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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
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
import { LoginJWTResponseSchema } from 'src/utils/schemas/auth.schema';
import { StoreResponseSchema } from 'src/utils/schemas/users.schema';

@ApiTags('Authentication/Email')
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

  // ~ ######## LOGIN ########
  // * ######  POST /auth/email/stores/login ######
  @ApiOperation({
    summary: 'Store login',
    description: 'Login a store with email and password.',
  })
  @ApiOkResponse({
    description: 'The store has been successfully logged in.',
    schema: LoginJWTResponseSchema,
  })
  @ApiNotFoundResponse({ description: 'The store was not found.' })
  @ApiUnprocessableEntityResponse({ description: 'Incorrect password.' })
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

  // * ######  POST /auth/email/customers/login ######
  @ApiOperation({
    summary: 'Customer login',
    description: 'Login a customer with email and password.',
  })
  @ApiOkResponse({
    description: 'The customer has been successfully logged in.',
    schema: LoginJWTResponseSchema,
  })
  @ApiNotFoundResponse({ description: 'The customer was not found.' })
  @ApiUnprocessableEntityResponse({ description: 'Incorrect password.' })
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

  // * ######  POST /auth/email/admin/login ######
  @ApiOperation({
    summary: 'Admin login',
    description: 'Login an admin with email and password.',
  })
  @ApiOkResponse({
    description: 'The admin has been successfully logged in.',
    schema: LoginJWTResponseSchema,
  })
  @ApiNotFoundResponse({ description: 'The user was not found.' })
  @ApiUnprocessableEntityResponse({ description: 'Incorrect password.' })
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

  //~   ######## REGISTER ########
  // * ######  POST /auth/email/stores/register ######
  @ApiOperation({
    summary: 'Store registration',
    description: 'Register a store with email and password.',
  })
  @ApiCreatedResponse({
    description: 'The store has been successfully registered.',
    schema: LoginJWTResponseSchema,
  })
  @ApiInternalServerErrorResponse({ description: 'Error creating user.' })
  @ApiUnprocessableEntityResponse({
    description: 'The password must be at least 8 characters long.',
  })
  @Post('stores/register')
  @HttpCode(HttpStatus.CREATED)
  @Public()
  async registerStore(
    @Body() createUserDto: AuthRegisterStoreDto,
  ): Promise<LoginResponseType> {
    const store = await this.service.registerStore(createUserDto);
    if (store === 'errorCreatingUser')
      throw new InternalServerErrorException('error creating user');
    return store as LoginResponseType;
  }

  // * ######  POST /auth/email/customers/register ######
  @ApiOperation({
    summary: 'Customer registration',
    description: 'Register a customer with email and password.',
  })
  @ApiCreatedResponse({
    description: 'The customer has been successfully registered.',
    schema: LoginJWTResponseSchema,
  })
  @ApiInternalServerErrorResponse({ description: 'Error creating user.' })
  @ApiUnprocessableEntityResponse({
    description: 'The password must be at least 8 characters long.',
  })
  @Post('customers/register')
  @HttpCode(HttpStatus.CREATED)
  @Public()
  async registerCustomer(
    @Body() createUserDto: AuthRegisterCustomerDto,
  ): Promise<LoginResponseType> {
    const customer = await this.service.registerCustomer(createUserDto);
    if (customer === 'errorCreatingUser')
      throw new InternalServerErrorException('error creating user');
    return customer as LoginResponseType;
  }

  // * ######  POST /auth/email/customers/register/confirm ######
  // TODO: When the global user contains the email_confirmed column, make this for all users
  @ApiOperation({
    summary: 'Email confirmation',
    description:
      'Confirm the email of a customer to complete the registration process.',
  })
  @ApiNoContentResponse({
    description: 'The email has been successfully confirmed.',
  })
  @ApiNotFoundResponse({ description: 'The customer was not found.' })
  @ApiInternalServerErrorResponse({ description: 'Error confirming email.' })
  @ApiUnprocessableEntityResponse({
    description: 'The hash is empty.',
  })
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

  //~   ######## FORGOT PASSWORD ########
  // * ######  POST /auth/email/stores/password/forgot ######
  @ApiOperation({
    summary: 'Store forgot password',
    description:
      'Send an email to the store with a link to reset the password.',
  })
  @ApiNoContentResponse({
    description: 'The email has been successfully sent.',
  })
  @ApiNotFoundResponse({ description: 'The store was not found.' })
  @ApiUnprocessableEntityResponse({
    description: 'The email is not valid.',
  })
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
      throw new NotFoundException('user not found');
    }
  }

  // * ######  POST /auth/email/customers/password/forgot ######
  @ApiOperation({
    summary: 'Customer forgot password',
    description:
      'Send an email to the customer with a link to reset the password.',
  })
  @ApiNoContentResponse({
    description: 'The email has been successfully sent.',
  })
  @ApiNotFoundResponse({ description: 'The customer was not found.' })
  @ApiUnprocessableEntityResponse({
    description: 'The email is not valid.',
  })
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
      throw new NotFoundException('user not found');
    }
  }

  // * ######  POST /auth/email/stores/password/reset ######
  @ApiOperation({
    summary: 'Store reset password',
    description: 'Reset the password of a store with the hash sent by email.',
  })
  @ApiNoContentResponse({
    description: 'The password has been successfully reset.',
  })
  @ApiNotFoundResponse({ description: 'The store was not found.' })
  @ApiUnprocessableEntityResponse({
    description: 'The password must be at least 8 characters long.',
  })
  @Post('stores/password/reset')
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  async resetStorePassword(
    @Body() resetPasswordDto: AuthResetPasswordDto,
  ): Promise<void> {
    const result = await this.service.resetPassword(resetPasswordDto);
    if (result === 'userNotFound') {
      throw new NotFoundException('user not found');
    }
  }

  // * ######  POST /auth/email/customers/password/reset ######
  @ApiOperation({
    summary: 'Customer reset password',
    description:
      'Reset the password of a customer with the hash sent by email.',
  })
  @ApiNoContentResponse({
    description: 'The password has been successfully reset.',
  })
  @ApiNotFoundResponse({ description: 'The customer was not found.' })
  @ApiUnprocessableEntityResponse({
    description: 'The password must be at least 8 characters long.',
  })
  @Post('customers/password/reset')
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  async resetCustomerPassword(
    @Body() resetPasswordDto: AuthResetPasswordDto,
  ): Promise<void> {
    const result = await this.service.resetPassword(resetPasswordDto);
    if (result === 'userNotFound') {
      throw new NotFoundException('user not found');
    }
  }

  //~   ######## ME (whoami, update) ########
  // * ######  POST /auth/email/me/logout ######
  @ApiOperation({
    summary: 'Logout',
    description:
      'Logout the user by removing the token from the request object.',
  })
  @ApiNoContentResponse({
    description: 'The user has been successfully logged out.',
  })
  @ApiUnauthorizedResponse({
    description: 'The user is not logged in.',
  })
  @ApiInternalServerErrorResponse({ description: 'Error logging out.' })
  @ApiBearerAuth()
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

  // * ######  GET /auth/email/me ######
  @ApiOperation({
    summary: 'Me',
    description: 'Get the user data of the user in the request object.',
  })
  @ApiOkResponse({
    description: 'The user data has been successfully retrieved.',
    schema: StoreResponseSchema,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is not logged in.',
  })
  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @DestructureUser()
  @Get('me')
  @HttpCode(HttpStatus.OK)
  public me(@Request() req): Promise<NullableType<GeneralUser>> {
    return this.service.me(req.user);
  }

  // * ######  PATCH /auth/email/me/stores ######
  @ApiOperation({
    summary: 'Update store',
    description: 'Update the store data of the user in the request object.',
  })
  @ApiNoContentResponse({
    description: 'The store data has been successfully updated.',
  })
  @ApiUnauthorizedResponse({
    description: 'The user is not logged in.',
  })
  @ApiUnprocessableEntityResponse({ description: 'Invalid data' })
  @ApiUnprocessableEntityResponse({
    description: 'The email is not valid.',
  })
  @ApiBearerAuth()
  @Patch('me/stores')
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

  // * ######  PATCH /auth/email/me/customers ######
  @ApiOperation({
    summary: 'Update customer',
    description: 'Update the customer data of the user in the request object.',
  })
  @ApiNoContentResponse({
    description: 'The customer data has been successfully updated.',
  })
  @ApiUnauthorizedResponse({
    description: 'The user is not logged in.',
  })
  @ApiUnprocessableEntityResponse({
    description: 'The email is not valid.',
  })
  @ApiBearerAuth()
  @Patch('me/customers')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async updateCustomer(
    @Request() req,
    @Body() customerDto: AuthUpdateCustomerDto,
  ): Promise<void> {
    await this.service.updateCustomer(req.user, customerDto);
  }

  // * ######  PATCH /auth/email/me/password ######
  @ApiOperation({
    summary: 'Update password',
    description: 'Update the password of the user in the request object.',
  })
  @ApiNoContentResponse({
    description: 'The password has been successfully updated.',
  })
  @ApiUnauthorizedResponse({
    description: 'The user is not logged in.',
  })
  @ApiNotFoundResponse({ description: 'The user was not found.' })
  @ApiUnprocessableEntityResponse({ description: 'Incorret password' })
  @ApiUnprocessableEntityResponse({
    description: 'The password must be at least 8 characters long.',
  })
  @ApiBearerAuth()
  @Patch('me/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async updatePassword(
    @Request() req,
    @Body() passwordDto: AuthUpdatePasswordDto,
  ): Promise<void> {
    const result = await this.service.updatePassword(req.user, passwordDto);
    if (result) {
      //  result is userNotFound | incorrectPassword | missingOldPassword
      if (result === 'userNotFound') {
        throw new NotFoundException(result);
      } else {
        throw new UnprocessableEntityException(result);
      }
    }
  }

  // * ######  DELETE /auth/email/me ######
  @ApiOperation({
    summary: 'Delete',
    description: 'Soft-delete the user in the request object.',
  })
  @ApiNoContentResponse({
    description: 'The user has been successfully deleted.',
  })
  @ApiUnauthorizedResponse({
    description: 'The user is not logged in.',
  })
  @ApiBearerAuth()
  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Request() req): Promise<void> {
    await this.service.softDelete(req.user);
  }
}
