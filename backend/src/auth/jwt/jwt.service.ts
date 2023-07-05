import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import * as crypto from 'crypto';
import { User } from 'src/users/entities/user.entity';
import { Store } from 'src/users/stores/entities/store.entity';
import { Customer } from 'src/users/customers/entities/customer.entity';
import { UsersService } from '../../users/users.service';
import { StoresService } from 'src/users/stores/stores.service';
import { CustomersService } from 'src/users/customers/customers.service';
import { ForgotService } from 'src/users/forgot/forgot.service';
import { AuthLoginEmailDto } from './dtos/auth-login-email.dto';
import { AuthRegisterStoreDto } from './dtos/auth-register-store.dto';
import { AuthRegisterCustomerDto } from './dtos/auth-register-customer.dto';
import { AuthConfirmEmailDto } from './dtos/auth-confirm-email.dto';
import { AuthForgotPasswordDto } from './dtos/auth-forgot-password.dto';
import { AuthResetPasswordDto } from './dtos/auth-reset-password.dto';
import { AuthUpdatePasswordDto } from './dtos/auth-update-password.dto';
import { AuthUpdateStoreDto } from './dtos/auth-update-store.dto';
import { AuthUpdateCustomerDto } from './dtos/auth-update-customer.dto';
import { CreateStoreDto } from 'src/users/stores/dtos/create-store.dto';
import { CreateCustomerDto } from 'src/users/customers/dtos/create-customer.dto';
import { UpdateStoreDto } from 'src/users/stores/dtos/update-store.dto';
import { UpdateCustomerDto } from 'src/users/customers/dtos/update-customer.dto';
import {
  JWTPayload,
  AuthProvidersEnum,
  LoginResponseType,
  SocialInterface,
} from '../auth.types';
import { GeneralUser } from 'src/users/users.types';
import { UserTypesEnum } from 'src/users/user-types/user_types.enum';
import { RolesEnum } from 'src/users/roles/roles.enum';
import { NullableType } from 'src/utils/types/nullable.type';
import { compareHashedPassword } from 'src/utils/hash-password';

@Injectable()
// TODO: In the methods that return void in the controller, generate more errors, so that the user knows what happened
export class JWTService {
  constructor(
    private nestJwtService: NestJwtService,
    private readonly usersService: UsersService,
    private readonly storesService: StoresService,
    private readonly customersService: CustomersService,
    private readonly forgotService: ForgotService,
    private configService: ConfigService,
  ) {}

  private generateToken(user: User): LoginResponseType {
    const userType = user.user_type_id;
    const role = user.role_id;

    const token: JWTPayload = {
      id: user.id,
      userType,
      role,
      provider:
        user instanceof Customer ? AuthProvidersEnum[user.provider] : undefined,
    };

    const tokenSigned = this.nestJwtService.sign(token);

    return {
      token: tokenSigned,
      user,
    };
  }

  async validateLogin(
    loginDto: AuthLoginEmailDto,
    userType: UserTypesEnum,
    onlyAdmin: boolean,
  ): Promise<string | LoginResponseType> {
    const user: NullableType<User> = await this.usersService.findOne({
      user_type_id: userType,
      email: loginDto.email,
    });

    // User doesn't exists || User isn't admin and onlyAdmin=true || User is a guest and onlyAdmin=false
    if (
      !user ||
      (onlyAdmin && user.role_id !== RolesEnum.admin) ||
      (!onlyAdmin &&
        !Object.values(RolesEnum).includes(user.role_id) &&
        RolesEnum.guest === user.role_id)
    ) {
      return 'userNotFound';
    }
    if (userType === UserTypesEnum.customer) {
      const customer = await this.customersService.findOne({
        user_id: +user.id,
      });
      if (customer.provider !== AuthProvidersEnum.email) {
        return `needLoginViaProvider:${customer.provider}`;
      }
    }
    if (userType === UserTypesEnum.store) {
      const store = await this.storesService.findOne({
        user_id: +user.id,
      });
      if (!store.approved) {
        return 'storeNotApproved';
      }
    }
    if (!user.password) {
      return 'userWithoutPassword';
    }

    const isValidPassword = await compareHashedPassword(
      loginDto.password,
      user.password,
      this.configService.get('PEPPER'),
    );

    if (!isValidPassword) {
      return 'incorrectPassword';
    }

    return this.generateToken(user);
  }

  // Only for customers
  async validateSocialLogin(
    authProvider: string,
    socialData: SocialInterface,
  ): Promise<string | LoginResponseType> {
    let customer: NullableType<Customer>;

    const socialEmail = socialData.email?.toLowerCase();
    const customerByEmail: NullableType<Customer> =
      await this.customersService.findOne({ email: socialEmail });

    customer = await this.customersService.findOne({
      social_id: socialData.id,
      provider: authProvider,
    });

    if (!customer) {
      return 'UserNotFound'; // ~ In controller throw error: Unprocessable Entity
    }

    if (customer) {
      if (socialEmail && !customerByEmail) {
        // Updates customer email if it's not set
        customer.user.email = socialEmail;
      }
      await this.customersService.update(customer.id, customer);
    } else if (customerByEmail) {
      // If the customer is already registered with the same email, then we update the social_id and provider
      customer = customerByEmail;
      customer.social_id = socialData.id;
      customer.provider = authProvider;
    } else {
      // If the customer is not registered, then we create a new customer with the social data
      customer = await this.customersService.create({
        role_id: RolesEnum.customer,
        email: socialEmail ?? null,
        first_name: socialData.first_name ?? null,
        last_name: socialData.last_name ?? null,
        social_id: socialData.id,
        provider: authProvider,
      });

      customer = await this.customersService.findOne({
        id: customer.id,
      });
    }

    return this.generateToken(customer.user);
  }

  async registerStore(
    registerDto: AuthRegisterStoreDto,
  ): Promise<string | LoginResponseType> {
    const createStoreDto: CreateStoreDto = {
      role_id: RolesEnum.unapprovedStore,
      approved: false,
      ...registerDto,
    };

    const store = await this.storesService.create(createStoreDto);
    if (!store) {
      return 'errorCreatingUser';
    }
    // TODO: When the global user contains the email_confirmed column, generate and include hash
    // TODO: Send email to the user
    // await this.mailService.userSignUp({ to: dto.email, data: { hash } });
    // TODO: Send email to the admin
    // TODO: Create an admin route to handle this

    // After registration, if everything went well, it will automatically log in
    return this.generateToken(store.user);
  }

  async registerCustomer(
    registerDto: AuthRegisterCustomerDto,
  ): Promise<string | LoginResponseType> {
    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const createCustomerDto: CreateCustomerDto = {
      role_id: RolesEnum.unconfirmedCustomer,
      email_confirmed: false,
      provider: AuthProvidersEnum.email,
      social_id: null,
      hash,
      ...registerDto,
    };

    const customer = await this.customersService.create(createCustomerDto);
    if (!customer) {
      return 'errorCreatingUser';
    }

    // TODO: Send email to the user instead of logging the hash
    console.log(`hash: ${hash}`);
    // await this.mailService.userSignUp({ to: dto.email, data: { hash } });

    // After registration, if everything went well, it will automatically log in
    return this.generateToken(customer.user);
  }

  async confirmEmail({ hash }: AuthConfirmEmailDto): Promise<string> {
    // TODO: When the global user contains the email_confirmed column, make it global
    const customer = await this.customersService.findOne({ hash });
    if (!customer) {
      return 'userNotFound';
    }

    customer.user.hash = null;
    customer.email_confirmed = true;
    await this.customersService.update(customer.id, customer);
    return '';
  }

  async forgotPassword(
    userType: UserTypesEnum,
    { email }: AuthForgotPasswordDto,
  ): Promise<string> {
    const user_type_id = userType;
    const user = await this.usersService.findOne({ user_type_id, email });
    if (!user) {
      return 'userNotFound';
    }

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    await this.forgotService.create({
      hash,
      user_id: user.id,
    });

    // TODO: Send email to the user instead of logging the hash
    console.log(`hash: ${hash}`);
    // await this.mailService.forgotPassword({ to: email, data: { hash} });

    return '';
  }

  async resetPassword({
    hash,
    password,
  }: AuthResetPasswordDto): Promise<string> {
    const forgot = await this.forgotService.findOne({ hash });
    if (!forgot) {
      return 'userNotFound';
    }

    await this.usersService.update(forgot.user_id, {
      password,
    });
    await this.forgotService.softDelete(forgot.id);

    return '';
  }

  async me(token: JWTPayload): Promise<NullableType<GeneralUser>> {
    if (!token) {
      return null;
    }
    if (token.userType === UserTypesEnum.customer) {
      return await this.customersService.findOne({ user_id: token.id });
    }
    if (token.userType === UserTypesEnum.store) {
      return await this.storesService.findOne({ user_id: token.id });
    }
    return null;
  }

  async updatePassword(
    token: JWTPayload,
    passwordDto: AuthUpdatePasswordDto,
  ): Promise<string> {
    if (passwordDto.password) {
      if (passwordDto.oldPassword) {
        const currentUser = await this.usersService.findOne({ id: token.id });
        if (!currentUser) {
          return 'userNotFound';
        }
        const isValidOldPassword = await compareHashedPassword(
          passwordDto.oldPassword,
          currentUser.password,
          this.configService.get('PEPPER'),
        );
        if (!isValidOldPassword) {
          return 'incorrectOldPassword';
        }
      } else {
        // TODO: Handle the case where the customer wants to convert from social to email
        return 'missingOldPassword';
      }
    } else {
      return 'missingPassword';
    }

    await this.usersService.update(token.id, {
      password: passwordDto.password,
    });
    return '';
  }

  updateStore(token: JWTPayload, storeDto: AuthUpdateStoreDto): Promise<Store> {
    const updateStoreDto: UpdateStoreDto = storeDto;
    // TODO: When the global user contains the email_confirmed column, uncomment this
    //   if (storeDto.email) {
    //     const hash = crypto
    //     .createHash('sha256')
    //     .update(randomStringGenerator())
    //     .digest('hex');

    //   updateStoreDto.email_confirmed = false;
    //   updateStoreDto.role_id = RolesEnum.unconfirmedCustomer;
    //   updateStoreDto.hash = hash;
    //   // TODO: Send email to the user
    //   // await this.mailService.userSignUp({ to: dto.email, data: { hash } });
    // }
    return this.storesService.update(token.id, updateStoreDto, 'user');
  }

  updateCustomer(
    token: JWTPayload,
    customerDto: AuthUpdateCustomerDto,
  ): Promise<Customer> {
    const updateCustomerDto: UpdateCustomerDto = customerDto;
    if (customerDto.email) {
      const hash = crypto
        .createHash('sha256')
        .update(randomStringGenerator())
        .digest('hex');

      updateCustomerDto.email_confirmed = false;
      updateCustomerDto.role_id = RolesEnum.unconfirmedCustomer;
      updateCustomerDto.hash = hash;
      // TODO: Send email to the user instead of logging the hash
      console.log(`hash: ${hash}`);
      // await this.mailService.userSignUp({ to: dto.email, data: { hash } });
    }
    return this.customersService.update(token.id, updateCustomerDto, 'user');
  }

  softDelete(token: JWTPayload): Promise<boolean> {
    if (token.userType === UserTypesEnum.customer) {
      return this.customersService.softDelete(token.id, 'user');
    }
    if (token.userType === UserTypesEnum.store) {
      return this.storesService.softDelete(token.id, 'user');
    }
    return null;
  }
}
