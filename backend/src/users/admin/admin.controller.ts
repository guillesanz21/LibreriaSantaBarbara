import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  DefaultValuePipe,
  ParseIntPipe,
  NotFoundException,
  SerializeOptions,
  HttpCode,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { AdminService } from './admin.service';
import { UsersService } from '../users.service';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { UpdateAdminDto } from './dtos/update-admin.dto';
import { AproveRejectStroreDto } from './dtos/aprove-reject-store.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesEnum } from '../roles/roles.enum';
import { UserTypesEnum } from '../user-types/user_types.enum';
import { NullableType } from 'src/utils/types/nullable.type';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { infinityPagination } from 'src/utils/infinity-pagination';

@ApiTags('Users/Admin')
@ApiUnauthorizedResponse({
  description: 'The user is not logged in.',
})
@ApiForbiddenResponse({
  description: "The user hasn't the right role (admin).",
})
@ApiUnprocessableEntityResponse({
  description: 'The email is not valid.',
})
@ApiBearerAuth()
@Controller()
@Roles(RolesEnum.admin)
export class AdminController {
  constructor(
    private readonly usersService: UsersService,
    private readonly adminService: AdminService,
  ) {}

  //~ ######  Admin specific endpoints ######
  // * ######  POST /users/admin/stores/approve (Auth)[Admin] ######
  @ApiOperation({
    summary: 'Approve a store',
    description: 'Approve a store.',
  })
  @ApiNoContentResponse({
    description: 'The store has been successfully approved.',
  })
  @ApiUnprocessableEntityResponse({
    description: 'The store is already approved.',
  })
  @ApiNotFoundResponse({
    description: 'The user is not found.',
  })
  @Post('/stores/approve')
  @HttpCode(HttpStatus.NO_CONTENT)
  async aproveStore(@Body() body: AproveRejectStroreDto): Promise<void> {
    const result = await this.adminService.aproveStore(body);
    if (['UserNotFound', 'StoreNotFound'].includes(result)) {
      throw new NotFoundException(result);
    }
    if (result) {
      throw new UnprocessableEntityException(result);
    }
  }

  // * ######  POST /users/admin/stores/reject (Auth)[Admin] ######
  @ApiOperation({
    summary: 'Reject a store',
    description: 'Reject a store.',
  })
  @ApiNoContentResponse({
    description: 'The store has been successfully rejected.',
  })
  @ApiUnprocessableEntityResponse({
    description: 'The store is already rejected.',
  })
  @ApiNotFoundResponse({
    description: 'The user is not found.',
  })
  @Post('/stores/reject')
  @HttpCode(HttpStatus.NO_CONTENT)
  async rejectStore(@Body() body: AproveRejectStroreDto): Promise<void> {
    const result = await this.adminService.rejectStore(body);
    if (['UserNotFound', 'StoreNotFound'].includes(result)) {
      throw new NotFoundException(result);
    }
    if (result) {
      throw new UnprocessableEntityException(result);
    }
  }

  //~ ######  Usual CRUD ######
  // * ######  POST /users/admin (Auth)[Admin] ######
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Create a new user (default: admin).',
  })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: User,
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreateAdminDto): Promise<User> {
    return this.usersService.create(body);
  }

  // * ######  GET /users/admin (Auth)[Admin] ######
  @ApiOperation({
    summary: 'Get all the users by filtering them',
    description:
      "Get all the filtered users (doesn't return user type specific fields).",
  })
  @ApiQuery({
    name: 'user-type',
    description: 'User Type (1: Admin, 2: Store, 3: Customer)',
    required: false,
    enum: UserTypesEnum,
  })
  @ApiQuery({
    name: 'role',
    description:
      'Role (1: Admin, 2: Store, 3: Customer, 4: Unapproved Store, 5: Unconfirmed, 6: Guest)',
    required: false,
    enum: RolesEnum,
  })
  @ApiQuery({ name: 'email', required: false })
  @ApiQuery({ name: 'NIF', required: false })
  @ApiQuery({ name: 'address', required: false })
  @ApiQuery({ name: 'phone', required: false })
  @ApiQuery({ name: 'email-confirmed', required: false })
  @ApiOkResponse({
    description: 'The records have been successfully retrieved.',
    type: [User],
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  findMany(
    @Query('user-type') user_type_id?: number,
    @Query('role') role_id?: number,
    @Query('email') email?: string,
    @Query('NIF') NIF?: string,
    @Query('address') address?: string,
    @Query('phone') phone_number?: string,
    @Query('email-confirmed') email_confirmed?: NullableType<boolean>,
  ): Promise<User[]> {
    return this.usersService.findMany({
      user_type_id: +user_type_id ? +user_type_id : undefined,
      role_id: role_id ? +role_id : undefined,
      email,
      NIF,
      address,
      phone_number,
      email_confirmed,
    });
  }

  // * ######  GET /users/admin/pagination (Auth)[Admin] ######
  @ApiOperation({
    summary: 'Get all the users by filtering them (with pagination)',
    description:
      "Get all the filtered users (with pagination) (doesn't return user type specific fields).",
  })
  @ApiQuery({ name: 'page', description: 'Page number', required: true })
  @ApiQuery({ name: 'limit', description: 'Results/page', required: true })
  @ApiQuery({
    name: 'user-type',
    description: 'User Type (1: Admin, 2: Store, 3: Customer)',
    required: false,
    enum: UserTypesEnum,
  })
  @ApiQuery({
    name: 'role',
    description:
      'Role (1: Admin, 2: Store, 3: Customer, 4: Unapproved Store, 5: Unconfirmed, 6: Guest)',
    required: false,
    enum: RolesEnum,
  })
  @ApiQuery({ name: 'email', required: false })
  @ApiQuery({ name: 'NIF', required: false })
  @ApiQuery({ name: 'address', required: false })
  @ApiQuery({ name: 'phone', required: false })
  @ApiQuery({ name: 'email-confirmed', required: false })
  @ApiOkResponse({
    description: 'The records have been successfully retrieved.',
    schema: {
      allOf: [
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/User' },
            },
            hasNextPage: { type: 'boolean' },
          },
        },
      ],
    },
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get('/pagination')
  @HttpCode(HttpStatus.OK)
  async findManyWithPagination(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('user-type') user_type_id?: number,
    @Query('role') role_id?: number,
    @Query('email') email?: string,
    @Query('NIF') NIF?: string,
    @Query('address') address?: string,
    @Query('phone') phone_number?: string,
    @Query('email-confirmed') email_confirmed?: NullableType<boolean>,
  ): Promise<InfinityPaginationResultType<User>> {
    if (limit > 50) {
      limit = 50;
    }
    return infinityPagination(
      await this.usersService.findManyWithPagination(
        {
          user_type_id: +user_type_id ? +user_type_id : undefined,
          role_id: role_id ? +role_id : undefined,
          email,
          NIF,
          address,
          phone_number,
          email_confirmed,
        },
        {
          page,
          limit,
        },
      ),
      { page, limit },
    );
  }

  // * ######  GET /users/admin/:id (Auth)[Admin] ######
  @ApiOperation({
    summary: 'Get a user by ID',
    description: 'Get the specified user by its ID (user_id).',
  })
  @ApiOkResponse({
    description: 'The record has been successfully retrieved.',
    type: User,
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number): Promise<NullableType<User>> {
    const store = await this.usersService.findOne({ id: +id });
    if (!store) {
      throw new NotFoundException('store not found');
    }
    return store;
  }

  // * ######  PATCH /users/admin/:id (Auth)[Admin] ######
  @ApiOperation({
    summary: 'Update a user.',
    description:
      'Update the specified user by its ID (user_id) with the specified data.',
  })
  @ApiNoContentResponse({
    description: 'The record has been successfully updated.',
  })
  @ApiUnprocessableEntityResponse({
    description: 'The email is not valid.',
  })
  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('id') id: number,
    @Body() body: UpdateAdminDto,
  ): Promise<void> {
    const result = await this.usersService.update(id, body);
    if (!result) {
      throw new NotFoundException('store not found');
    }
  }

  // * ######  DELETE /users/admin/:id (Auth)[Admin] ######
  @ApiOperation({
    summary: 'Delete a user',
    description: 'Delete the specified user by its ID (user_id).',
  })
  @ApiQuery({
    name: 'mode',
    description: 'Delete mode (soft or hard). Default: soft',
    required: false,
    enum: ['soft', 'hard'],
  })
  @ApiNoContentResponse({
    description: 'The record has been successfully deleted.',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: number,
    @Query('mode') deleteMode?: string,
  ): Promise<void> {
    let result: boolean;
    if (deleteMode && deleteMode === 'hard') {
      result = await this.usersService.hardDelete(id);
    } else {
      result = await this.usersService.softDelete(id);
    }
    if (!result) {
      throw new NotFoundException('store not found');
    }
  }

  // * ######  PATCH /users/admin/:id/restore (Auth)[Admin] ######
  @ApiOperation({
    summary: 'Restore a user',
    description: 'Restore a soft deleted user specified  by its ID (user_id).',
  })
  @ApiNoContentResponse({
    description: 'The record has been successfully restored.',
  })
  @Patch(':id/restore')
  @HttpCode(HttpStatus.NO_CONTENT)
  async restore(@Param('id') id: number): Promise<void> {
    const result = await this.usersService.restore(id);
    if (!result) {
      throw new NotFoundException('store not found');
    }
  }
}
