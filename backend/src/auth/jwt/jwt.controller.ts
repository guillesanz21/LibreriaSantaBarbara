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
import { AuthLoginEmailStoreDto } from './dtos/auth-login-email-store.dto';
import { AuthLoginEmailCustomerDto } from './dtos/auth-login-email-customer.dto';
import { AuthRegisterStoreDto } from './dtos/auth-register-store.dto';
import { AuthRegisterCustomerDto } from './dtos/auth-register-customer.dto';
import { AuthForgotPasswordDto } from './dtos/auth-forgot-password.dto';
import { AuthConfirmEmailDto } from './dtos/auth-confirm-email.dto';
import { AuthResetPasswordDto } from './dtos/auth-reset-password.dto';
import { AuthUpdatePasswordDto } from './dtos/auth-update-password.dto';
import { AuthUpdateStoreDto } from './dtos/auth-update-store.dto';
import { AuthUpdateCustomerDto } from './dtos/auth-update-customer.dto';
import { LoginResponseType } from '../auth.types';
import { NullableType } from 'src/utils/types/nullable.type';
import { User, UserType } from 'src/users/users.types';

@Controller()
export class JwtController {
  constructor(private readonly service: JWTService) {}

  private async login(
    userType: UserType,
    loginDto: AuthLoginEmailStoreDto | AuthLoginEmailCustomerDto,
  ): Promise<LoginResponseType> {
    const result = await this.service.validateLogin(loginDto, userType);
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
    @Body() loginDto: AuthLoginEmailStoreDto,
  ): Promise<LoginResponseType> {
    return await this.login('store', loginDto);
  }

  @Post('customers/login')
  public async loginCustomer(
    @Body() loginDto: AuthLoginEmailCustomerDto,
  ): Promise<LoginResponseType> {
    return await this.login('customer', loginDto);
  }

  // TODO: Admin login
  //   @Post('admin/email/login')
  //   public adminLogin(@Body() loginDTO: AuthEmailLoginDto): Promise<JWTPayload> {
  //     return this.service.validateLogin(loginDTO, true);
  //   }

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

  @Post('customers/register/confirm')
  async confirmEmail(
    @Body() confirmEmailDto: AuthConfirmEmailDto,
  ): Promise<boolean> {
    const result = await this.service.confirmEmail(confirmEmailDto);
    if (result === 'userNotFound') {
      throw new NotFoundException('user not found');
    }
    return true;
  }

  // *   ######## FORGOT PASSWORD ########
  @Post('stores/password/forgot')
  async forgotStorePassword(
    @Body() forgotPasswordDto: AuthForgotPasswordDto,
  ): Promise<boolean> {
    const result = await this.service.forgotPassword(
      'store',
      forgotPasswordDto,
    );
    if (result === 'userNotFound') {
      throw new UnprocessableEntityException('user not found');
    }
    return true;
  }

  @Post('customers/password/forgot')
  async forgotCustomerPassword(
    @Body() forgotPasswordDto: AuthForgotPasswordDto,
  ): Promise<boolean> {
    const result = await this.service.forgotPassword(
      'customer',
      forgotPasswordDto,
    );
    if (result === 'userNotFound') {
      throw new UnprocessableEntityException('user not found');
    }
    return true;
  }

  @Post('stores/password/reset')
  async resetStorePassword(
    @Body() resetPasswordDto: AuthResetPasswordDto,
  ): Promise<boolean> {
    const result = await this.service.resetPassword('store', resetPasswordDto);
    if (result === 'userNotFound') {
      throw new UnprocessableEntityException('user not found');
    }
    return true;
  }

  @Post('customers/password/reset')
  async resetCustomerPassword(
    @Body() resetPasswordDto: AuthResetPasswordDto,
  ): Promise<boolean> {
    const result = await this.service.resetPassword(
      'customer',
      resetPasswordDto,
    );
    if (result === 'userNotFound') {
      throw new UnprocessableEntityException('user not found');
    }
    return true;
  }

  // *   ######## ME (whoami, update) ########
  @Post('me/logout')
  @UseGuards(AuthGuard('jwt'))
  async logoutStore(@Request() req): Promise<boolean> {
    // TODO: check if this works
    req.logout((err: string) => {
      if (err) {
        throw new InternalServerErrorException(err);
      }
      return true;
    });
    return true;
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  public me(@Request() req): Promise<NullableType<User>> {
    return this.service.me(req.user);
  }

  @Patch('stores/update')
  @UseGuards(AuthGuard('jwt'))
  public async updateStore(
    @Request() req,
    @Body() storeDto: AuthUpdateStoreDto,
  ): Promise<NullableType<User>> {
    const store = await this.service.updateStore(req.user, storeDto);
    if (typeof store === 'string') {
      //  result is invalidCustomerUpdate | invalidStoreUpdate
      throw new UnprocessableEntityException(store);
    }
    return store;
  }
  @Patch('customers/update')
  @UseGuards(AuthGuard('jwt'))
  public async updateCustomer(
    @Request() req,
    @Body() customerDto: AuthUpdateCustomerDto,
  ): Promise<NullableType<User>> {
    return this.service.updateCustomer(req.user, customerDto);
  }

  @Patch('me/password')
  @UseGuards(AuthGuard('jwt'))
  public async updatePassword(
    @Request() req,
    @Body() passwordDto: AuthUpdatePasswordDto,
  ): Promise<boolean> {
    const result = await this.service.updatePassword(req.user, passwordDto);
    if (result) {
      //  result is userNotFound | incorrectPassword | missingOldPassword
      throw new UnprocessableEntityException(result);
    }
    return true;
  }

  @Delete('me')
  @UseGuards(AuthGuard('jwt'))
  public async delete(@Request() req): Promise<boolean> {
    return this.service.softDelete(req.user);
  }
}
