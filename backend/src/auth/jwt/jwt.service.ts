import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import * as crypto from 'crypto';
import { Store } from 'src/users/stores/entities/store.entity';
import { Customer } from 'src/users/customers/entities/customer.entity';
import { UsersService } from '../../users/users.service';
import { AuthEmailStoreLoginDto } from './dtos/auth-email-store-login.dto';
import { AuthEmailCustomerLoginDto } from './dtos/auth-email-customer-login.dto';
import { AuthRegisterStoreLoginDto } from './dtos/auth-register-store-login.dto';
import { AuthRegisterCustomerLoginDto } from './dtos/auth-register-customer-login.dto';
import { AuthConfirmEmailDto } from './dtos/auth-confirm-email.dto';
import { AuthForgotPasswordDto } from './dtos/auth-forgot-password.dto';
import { AuthResetPasswordDto } from './dtos/auth-reset-password.dto';
import { AuthUpdatePasswordDto } from './dtos/auth-update-password.dto';
import { AuthUpdateStoreDto } from './dtos/auth-update-store.dto';
import { AuthUpdateCustomerDto } from './dtos/auth-update-customer.dto';
import {
  JWTPayload,
  AuthProvidersEnum,
  LoginResponseType,
  SocialInterface,
} from '../auth.types';
import { User, UserType } from 'src/users/users.types';
import { NullableType } from 'src/utils/types/nullable.type';
import { compareHashedPassword, hashPassword } from 'src/utils/hash-password';

@Injectable()
export class JWTService {
  constructor(
    private nestJwtService: NestJwtService,
    private readonly usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async validateLogin(
    loginDto: AuthEmailStoreLoginDto | AuthEmailCustomerLoginDto,
    userType: UserType,
    // onlyAdmin: boolean, // CHECK: What about this?
  ): Promise<string | LoginResponseType> {
    const user: NullableType<User> = await this.usersService.findOne(userType, {
      email: loginDto.email,
    });

    if (!user) {
      return 'userNotFound';
    }
    if (
      userType === 'customer' &&
      user instanceof Customer &&
      (user as Customer).provider !== AuthProvidersEnum.email
    ) {
      return `needLoginViaProvider:${(user as Customer).provider}`;
    }

    const isValidPassword = await compareHashedPassword(
      loginDto.password,
      user.password,
      this.configService.get('PEPPER'),
    );

    if (!isValidPassword) {
      return 'incorrectPassword';
    }

    const token: JWTPayload = {
      id: user.id,
      role: 'store', // CHECK: store or customer. What about admin?
      admin: false,
      provider:
        user instanceof Customer ? AuthProvidersEnum[user.provider] : undefined,
    };

    const tokenSigned = this.nestJwtService.sign(token);

    return {
      token: tokenSigned,
      user,
    };
  }

  // Only for customers
  async validateSocialLogin(
    authProvider: string,
    socialData: SocialInterface,
  ): Promise<string | LoginResponseType> {
    let user: NullableType<Customer>;

    const socialEmail = socialData.email?.toLowerCase();
    const userByEmail: NullableType<Customer> =
      (await this.usersService.findOne('customer', {
        email: socialEmail,
      })) as NullableType<Customer>;

    user = (await this.usersService.findOne('customer', {
      social_id: socialData.id,
      provider: authProvider,
    })) as NullableType<Customer>;

    if (!user) {
      return 'UserNotFound'; // ~ In controller throw error: Unprocessable Entity
    }

    if (user) {
      if (socialEmail && !userByEmail) {
        // Updates user email if it's not set
        user.email = socialEmail;
      }
      await this.usersService.update('customer', user.id, user);
    } else if (userByEmail) {
      // If the user is already registered with the same email, then we update the social_id and provider
      user = userByEmail;
    } else {
      // If the user is not registered, then we create a new user with the social data
      user = (await this.usersService.create('customer', {
        email: socialEmail ?? null,
        first_name: socialData.first_name ?? null,
        last_name: socialData.last_name ?? null,
        social_id: socialData.id,
        provider: authProvider,
      })) as NullableType<Customer>;

      user = (await this.usersService.findOne('customer', {
        id: user.id,
      })) as NullableType<Customer>;
    }

    const token: JWTPayload = {
      id: user.id,
      role: 'customer',
      provider: AuthProvidersEnum[authProvider],
      admin: false,
    };

    const tokenSigned = this.nestJwtService.sign(token);

    return {
      token: tokenSigned,
      user,
    };
  }

  async register(
    dto: AuthRegisterStoreLoginDto | AuthRegisterCustomerLoginDto,
    userType: UserType,
  ): Promise<User> {
    return userType === 'store' && dto instanceof AuthRegisterStoreLoginDto
      ? await this.registerStore(dto)
      : userType === 'customer' && dto instanceof AuthRegisterCustomerLoginDto
      ? await this.registerCustomer(dto)
      : null;
  }

  private async registerStore(dto: AuthRegisterStoreLoginDto): Promise<Store> {
    const store = await this.usersService.create('store', dto);
    // TODO: Send email to the admin
    // TODO: Create an admin route to handle this
    return store as Store;
  }
  private async registerCustomer(
    dto: AuthRegisterCustomerLoginDto,
  ): Promise<Customer> {
    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const customer = await this.usersService.create('customer', {
      ...dto,
      hash,
    });
    // TODO: Send email to the user
    // await this.mailService.userSignUp({ to: dto.email, data: { hash } });

    return customer as Customer;
  }

  async confirmEmail({ hash }: AuthConfirmEmailDto): Promise<string> {
    const user: NullableType<Customer> = (await this.usersService.findOne(
      'customer',
      {
        hash: hash,
      },
    )) as NullableType<Customer>;

    if (!user) {
      return 'userNotFound';
    }
    user.hash = null;

    await user.save();
    return '';
  }

  async forgotPassword(
    userType: UserType,
    { email }: AuthForgotPasswordDto,
  ): Promise<string> {
    const user = await this.usersService.findOne(userType, {
      email,
    });

    if (!user) {
      return 'userNotFound';
    }

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    await this.usersService.update(userType, user.id, { hash });

    // TODO: Send email to the user
    // await this.mailService.forgotPassword({ to: email, data: { hash} });

    return '';
  }

  async resetPassword(
    userType: UserType,
    { hash, password }: AuthResetPasswordDto,
  ): Promise<string> {
    const user = await this.usersService.findOne(userType, { hash });

    if (!user) {
      return 'userNotFound';
    }

    const pepper = this.configService.get('auth.pepper', { infer: true });
    const saltRounds = this.configService.get('auth.salt_rounds', {
      infer: true,
    });
    const hashedPassword = await hashPassword(password, pepper, +saltRounds);

    user.password = hashedPassword;
    user.hash = null;
    await user.save();

    return '';
  }

  async me(token: JWTPayload): Promise<NullableType<User>> {
    return await this.usersService.findOne(token.role, { id: token.id });
  }

  async updatePassword(
    token: JWTPayload,
    passwordDto: AuthUpdatePasswordDto,
  ): Promise<string> {
    if (passwordDto.password) {
      if (passwordDto.oldPassword) {
        const currentUser = await this.usersService.findOne(token.role, {
          id: token.id,
        });

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
        return 'missingOldPassword';
      }
    }
    await this.usersService.update(token.role, token.id, passwordDto);
    return '';
  }

  async update(
    token: JWTPayload,
    userDto: AuthUpdateStoreDto | AuthUpdateCustomerDto,
  ): Promise<User> {
    return await this.usersService.update(token.role, token.id, userDto);
    // if (token.role === 'store') {
    //   return await this.updateStore(token.id, userDto);
    // }
    // if (token.role === 'customer') {
    //   return await this.updateCustomer(token.id, userDto);
    // }
  }

  // CHECK: If the AuthDTO is acting conditionally based on the role, if so, then DELETE:
  // private async updateStore(
  //   user_id: number,
  //   userDto: AuthUpdateStoreDto,
  // ): Promise<User> {
  //   return await this.usersService.update('store', user_id, userDto);
  // }
  // private async updateCustomer(
  //   user_id: number,
  //   userDto: AuthUpdateCustomerDto,
  // ): Promise<User> {
  //   return await this.usersService.update('customer', user_id, userDto);
  // }

  async softDelete(token: JWTPayload): Promise<void> {
    await this.usersService.softDelete(token.role, token.id);
  }
}
