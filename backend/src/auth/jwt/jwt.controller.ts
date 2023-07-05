import {
  Body,
  Controller,
  Get,
  Request,
  Post,
  Patch,
  Delete,
  NotFoundException,
  UnprocessableEntityException,
  UnauthorizedException,
  InternalServerErrorException,
  SerializeOptions,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Public } from '../decorators/public.decorator';
import { JWTService } from './jwt.service';
import { AuthLoginEmailDto } from './dtos/auth-login-email.dto';
import { AuthRegisterStoreDto } from './dtos/auth-register-store.dto';
import { AuthRegisterCustomerDto } from './dtos/auth-register-customer.dto';
import { AuthForgotPasswordDto } from './dtos/auth-forgot-password.dto';
import { AuthConfirmEmailDto } from './dtos/auth-confirm-email.dto';
import { AuthResetPasswordDto } from './dtos/auth-reset-password.dto';
import { AuthUpdatePasswordDto } from './dtos/auth-update-password.dto';
import { AuthUpdateStoreDto } from './dtos/auth-update-store.dto';
import { AuthUpdateCustomerDto } from './dtos/auth-update-customer.dto';
import { GeneralUser } from 'src/users/users.types';
import { UserTypesEnum } from 'src/users/user-types/user_types.enum';
import { LoginResponseType } from '../auth.types';
import { NullableType } from 'src/utils/types/nullable.type';
import { DestructureUser } from 'src/users/interceptors/destructure-user.interceptor';

@Controller()
export class JwtController {
  constructor(private readonly service: JWTService) {}

  private async login(
    userType: UserTypesEnum,
    loginDto: AuthLoginEmailDto,
    onlyAdmin: boolean,
  ): Promise<LoginResponseType> {
    const result = await this.service.validateLogin(
      loginDto,
      userType,
      onlyAdmin,
    );
    if (typeof result === 'string' && result === 'userNotFound') {
      throw new NotFoundException('user not found');
    }
    if (typeof result === 'string' && result.includes('needLoginViaProvider')) {
      throw new UnauthorizedException(result);
    }
    if (typeof result === 'string' && result === 'incorrectPassword') {
      throw new UnprocessableEntityException('incorret password');
    }
    if (typeof result === 'string' && result === 'storeNotApproved') {
      throw new UnprocessableEntityException('store not approved');
    }
    if (typeof result === 'string' && result === 'userWithoutPassword') {
      throw new UnprocessableEntityException('user without password');
    }
    return result ? (result as LoginResponseType) : null;
  }

  // *   ######## LOGIN ########
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('stores/login')
  @Public()
  @HttpCode(HttpStatus.OK)
  public async loginStore(
    @Body() loginDto: AuthLoginEmailDto,
  ): Promise<LoginResponseType> {
    return await this.login(UserTypesEnum.store, loginDto, false);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('customers/login')
  @Public()
  @HttpCode(HttpStatus.OK)
  public async loginCustomer(
    @Body() loginDto: AuthLoginEmailDto,
  ): Promise<LoginResponseType> {
    return await this.login(UserTypesEnum.customer, loginDto, false);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('admin/login')
  @Public()
  @HttpCode(HttpStatus.OK)
  public adminLogin(
    @Body() loginDTO: AuthLoginEmailDto,
  ): Promise<LoginResponseType> {
    return this.login(UserTypesEnum.admin, loginDTO, true);
  }

  // *   ######## REGISTER ########
  @Post('stores/register')
  @HttpCode(HttpStatus.OK)
  @Public()
  async registerStore(
    @Body() createUserDto: AuthRegisterStoreDto,
  ): Promise<LoginResponseType> {
    const store = await this.service.registerStore(createUserDto);
    if (store === 'errorCreatingUser')
      throw new InternalServerErrorException('error creating user');
    return store as LoginResponseType;
  }

  @Post('customers/register')
  @HttpCode(HttpStatus.OK)
  @Public()
  async registerCustomer(
    @Body() createUserDto: AuthRegisterCustomerDto,
  ): Promise<LoginResponseType> {
    const customer = await this.service.registerCustomer(createUserDto);
    if (customer === 'errorCreatingUser')
      throw new InternalServerErrorException('error creating user');
    return customer as LoginResponseType;
  }

  // TODO: When the global user contains the email_confirmed column, make this for all users
  @Post('customers/register/confirm')
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmEmail(
    @Body() confirmEmailDto: AuthConfirmEmailDto,
  ): Promise<void> {
    try {
      const result = await this.service.confirmEmail(confirmEmailDto);
      if (result === 'userNotFound') {
        throw new NotFoundException('user not found');
      }
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  // *   ######## FORGOT PASSWORD ########
  @Post('stores/password/forgot')
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  async forgotStorePassword(
    @Body() forgotPasswordDto: AuthForgotPasswordDto,
  ): Promise<void> {
    const result = await this.service.forgotPassword(
      UserTypesEnum.store,
      forgotPasswordDto,
    );
    if (result === 'userNotFound') {
      throw new UnprocessableEntityException('user not found');
    }
  }

  @Post('customers/password/forgot')
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  async forgotCustomerPassword(
    @Body() forgotPasswordDto: AuthForgotPasswordDto,
  ): Promise<void> {
    const result = await this.service.forgotPassword(
      UserTypesEnum.customer,
      forgotPasswordDto,
    );
    if (result === 'userNotFound') {
      throw new UnprocessableEntityException('user not found');
    }
  }

  @Post('stores/password/reset')
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  async resetStorePassword(
    @Body() resetPasswordDto: AuthResetPasswordDto,
  ): Promise<void> {
    const result = await this.service.resetPassword(resetPasswordDto);
    if (result === 'userNotFound') {
      throw new UnprocessableEntityException('user not found');
    }
  }

  @Post('customers/password/reset')
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  async resetCustomerPassword(
    @Body() resetPasswordDto: AuthResetPasswordDto,
  ): Promise<void> {
    const result = await this.service.resetPassword(resetPasswordDto);
    if (result === 'userNotFound') {
      throw new UnprocessableEntityException('user not found');
    }
  }

  // *   ######## ME (whoami, update) ########
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('me/logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logoutStore(@Request() req): Promise<void> {
    await req.logout((err: string) => {
      if (err) {
        throw new InternalServerErrorException(err);
      }
    });
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @DestructureUser()
  @Get('me')
  @HttpCode(HttpStatus.OK)
  public me(@Request() req): Promise<NullableType<GeneralUser>> {
    return this.service.me(req.user);
  }

  @Patch('stores/update')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async updateStore(
    @Request() req,
    @Body() storeDto: AuthUpdateStoreDto,
  ): Promise<void> {
    const store = await this.service.updateStore(req.user, storeDto);
    if (typeof store === 'string') {
      //  result is invalidCustomerUpdate | invalidStoreUpdate
      throw new UnprocessableEntityException(store);
    }
  }

  @Patch('customers/update')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async updateCustomer(
    @Request() req,
    @Body() customerDto: AuthUpdateCustomerDto,
  ): Promise<void> {
    await this.service.updateCustomer(req.user, customerDto);
  }

  @Patch('me/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async updatePassword(
    @Request() req,
    @Body() passwordDto: AuthUpdatePasswordDto,
  ): Promise<void> {
    const result = await this.service.updatePassword(req.user, passwordDto);
    if (result) {
      //  result is userNotFound | incorrectPassword | missingOldPassword
      throw new UnprocessableEntityException(result);
    }
  }

  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Request() req): Promise<void> {
    await this.service.softDelete(req.user);
  }
}
