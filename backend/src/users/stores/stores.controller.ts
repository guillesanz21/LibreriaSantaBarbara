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
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Store } from './entities/store.entity';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dtos/create-store.dto';
import { UpdateStoreDto } from './dtos/update-store.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { DestructureUser } from '../interceptors/destructure-user.interceptor';
import { NullableType } from 'src/utils/types/nullable.type';
import { RolesEnum } from '../roles/roles.enum';
import { ExposeGroupsEnum } from 'src/utils/types/expose-groups.enum';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { StoreResponseSchema } from '../../utils/schemas/users.schema';

@ApiTags('Users/Stores')
@ApiExtraModels(Store)
@ApiUnauthorizedResponse({
  description: 'The admin is not logged in.',
})
@ApiForbiddenResponse({
  description: "The user hasn't the right role (admin).",
})
@ApiUnprocessableEntityResponse({
  description: 'The email is not valid.',
})
@ApiBearerAuth()
@Roles(RolesEnum.admin)
@Controller()
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  // * ######  POST /users/stores (Auth)[Admin] ######
  @ApiOperation({
    summary: 'Create a new store',
    description: '[Admin] Create a new store.',
  })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    schema: StoreResponseSchema,
  })
  @SerializeOptions({
    groups: [ExposeGroupsEnum.admin],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreateStoreDto): Promise<Store> {
    return this.storesService.create(body);
  }

  // * ######  GET /users/stores (Auth)[Admin] ######
  @ApiOperation({
    summary: 'Get all the stores by filtering them',
    description: '[Admin] Get all the filtered stores.',
  })
  @ApiQuery({ name: 'email', required: false })
  @ApiQuery({ name: 'NIF', required: false })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'address', required: false })
  @ApiQuery({ name: 'phone', required: false })
  @ApiQuery({
    name: 'role',
    description:
      'Role (1: Admin, 2: Store, 3: Customer, 4: Unapproved Store, 5: Unconfirmed, 6: Guest)',
    required: false,
    enum: RolesEnum,
  })
  @ApiQuery({ name: 'email-confirmed', required: false })
  @ApiQuery({ name: 'approved', required: false })
  @ApiOkResponse({
    description: 'The records have been successfully retrieved.',
    schema: {
      type: 'array',
      items: StoreResponseSchema,
    },
  })
  @SerializeOptions({
    groups: [ExposeGroupsEnum.admin],
  })
  @DestructureUser()
  @Get()
  @HttpCode(HttpStatus.OK)
  findMany(
    @Query('email') email?: string,
    @Query('NIF') NIF?: string,
    @Query('address') address?: string,
    @Query('phone') phone_number?: string,
    @Query('name') name?: string,
    @Query('role') role?: string,
    @Query('email-confirmed') email_confirmed?: NullableType<boolean>,
    @Query('approved') approved?: NullableType<boolean>,
  ): Promise<Store[]> {
    console.log('email_confirmed', email_confirmed);
    return this.storesService.findMany({
      email,
      NIF,
      address,
      phone_number,
      name,
      role,
      email_confirmed,
      approved,
    });
  }

  // * ######  GET /users/stores/pagination (Auth)[Admin] ######
  @ApiOperation({
    summary: 'Get all the stores by filtering them (with pagination)',
    description: '[Admin] Get all the filtered stores (with pagination).',
  })
  @ApiQuery({ name: 'page', description: 'Page number', required: true })
  @ApiQuery({ name: 'limit', description: 'Results/page', required: true })
  @ApiQuery({ name: 'email', required: false })
  @ApiQuery({ name: 'NIF', required: false })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'address', required: false })
  @ApiQuery({ name: 'phone', required: false })
  @ApiQuery({
    name: 'role',
    description:
      'Role (1: Admin, 2: Store, 3: Customer, 4: Unapproved Store, 5: Unconfirmed, 6: Guest)',
    required: false,
    enum: RolesEnum,
  })
  @ApiQuery({ name: 'email-confirmed', required: false })
  @ApiQuery({ name: 'approved', required: false })
  @ApiOkResponse({
    description: 'The records have been successfully retrieved.',
    schema: {
      allOf: [
        {
          properties: {
            data: {
              type: 'array',
              items: StoreResponseSchema,
            },
            hasNextPage: { type: 'boolean' },
          },
        },
      ],
    },
  })
  @SerializeOptions({
    groups: [ExposeGroupsEnum.admin],
  })
  @DestructureUser()
  @Get('/pagination')
  @HttpCode(HttpStatus.OK)
  async findManyWithPagination(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('email') email?: string,
    @Query('NIF') NIF?: string,
    @Query('address') address?: string,
    @Query('phone') phone_number?: string,
    @Query('name') name?: string,
    @Query('role') role?: string,
    @Query('email-confirmed') email_confirmed?: NullableType<boolean>,
    @Query('approved') approved?: NullableType<boolean>,
  ): Promise<InfinityPaginationResultType<Store>> {
    if (limit > 50) {
      limit = 50;
    }
    return infinityPagination(
      await this.storesService.findManyWithPagination(
        {
          email,
          NIF,
          address,
          phone_number,
          name,
          role,
          email_confirmed,
          approved,
        },
        {
          page,
          limit,
        },
      ),
      { page, limit },
    );
  }

  // * ######  GET /users/stores/:id (Auth)[Admin] ######
  @ApiOperation({
    summary: 'Get a store by ID',
    description: '[Admin] Get the specified store by its ID (store_id).',
  })
  @ApiOkResponse({
    description: 'The record has been successfully retrieved.',
    schema: StoreResponseSchema,
  })
  @SerializeOptions({
    groups: [ExposeGroupsEnum.admin],
  })
  @DestructureUser()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number): Promise<NullableType<Store>> {
    const store = await this.storesService.findOne({ id: +id });
    if (!store) {
      throw new NotFoundException('store not found');
    }
    return store;
  }

  // * ######  PATCH /users/stores/:id (Auth)[Admin] ######
  @ApiOperation({
    summary: 'Update a store.',
    description:
      '[Admin] Update the specified store by its ID (store_id) with the specified data.',
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
    @Body() body: UpdateStoreDto,
  ): Promise<void> {
    const result = await this.storesService.update(id, body);
    if (!result) {
      throw new NotFoundException('store not found');
    }
  }

  // * ######  DELETE /users/stores/:id (Auth)[Admin] ######
  @ApiOperation({
    summary: 'Delete a store',
    description: '[Admin] Delete the specified store by its ID (store_id).',
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
      result = await this.storesService.hardDelete(id);
    } else {
      result = await this.storesService.softDelete(id);
    }
    if (!result) {
      throw new NotFoundException('store not found');
    }
  }

  // * ######  PATCH /users/stores/:id/restore (Auth)[Admin] ######
  @ApiOperation({
    summary: 'Restore a store',
    description:
      '[Admin] Restore a soft deleted store specified  by its ID (store_id).',
  })
  @ApiNoContentResponse({
    description: 'The record has been successfully restored.',
  })
  @Patch(':id/restore')
  @HttpCode(HttpStatus.NO_CONTENT)
  async restore(@Param('id') id: number): Promise<void> {
    const result = await this.storesService.restore(id);
    if (!result) {
      throw new NotFoundException('store not found');
    }
  }
}
