import {
  Body,
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  Patch,
  Delete,
  NotFoundException,
  UnprocessableEntityException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
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
    return result ? (result as LoginResponseType) : null;
  }

  // *   ######## LOGIN ########
  @Post('stores/login')
  public async loginStore(
    @Body() loginDto: AuthLoginEmailDto,
  ): Promise<LoginResponseType> {
    return await this.login(UserTypesEnum.store, loginDto, false);
  }

  @Post('customers/login')
  public async loginCustomer(
    @Body() loginDto: AuthLoginEmailDto,
  ): Promise<LoginResponseType> {
    return await this.login(UserTypesEnum.customer, loginDto, false);
  }

  @Post('admin/email/login')
  public adminLogin(
    @Body() loginDTO: AuthLoginEmailDto,
  ): Promise<LoginResponseType> {
    return this.login(UserTypesEnum.admin, loginDTO, true);
  }

  // *   ######## REGISTER ########

  @Post('stores/register')
  async registerStore(
    @Body() createUserDto: AuthRegisterStoreDto,
  ): Promise<LoginResponseType> {
    const store = await this.service.registerStore(createUserDto);
    if (store === 'errorCreatingUser')
      throw new InternalServerErrorException('error creating user');
    return store as LoginResponseType;
  }

  @Post('customers/register')
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
  async resetStorePassword(
    @Body() resetPasswordDto: AuthResetPasswordDto,
  ): Promise<void> {
    const result = await this.service.resetPassword(resetPasswordDto);
    if (result === 'userNotFound') {
      throw new UnprocessableEntityException('user not found');
    }
  }

  @Post('customers/password/reset')
  async resetCustomerPassword(
    @Body() resetPasswordDto: AuthResetPasswordDto,
  ): Promise<void> {
    const result = await this.service.resetPassword(resetPasswordDto);
    if (result === 'userNotFound') {
      throw new UnprocessableEntityException('user not found');
    }
  }

  // *   ######## ME (whoami, update) ########
  @Post('me/logout')
  @UseGuards(AuthGuard('jwt'))
  async logoutStore(@Request() req): Promise<void> {
    // TODO: check if this works
    await req.logout((err: string) => {
      if (err) {
        throw new InternalServerErrorException(err);
      }
    });
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  public me(@Request() req): Promise<NullableType<GeneralUser>> {
    return this.service.me(req.user);
  }

  @Patch('stores/update')
  @UseGuards(AuthGuard('jwt'))
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
  @UseGuards(AuthGuard('jwt'))
  public async updateCustomer(
    @Request() req,
    @Body() customerDto: AuthUpdateCustomerDto,
  ): Promise<void> {
    await this.service.updateCustomer(req.user, customerDto);
  }

  @Patch('me/password')
  @UseGuards(AuthGuard('jwt'))
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
  @UseGuards(AuthGuard('jwt'))
  public async delete(@Request() req): Promise<void> {
    await this.service.softDelete(req.user);
  }
}
