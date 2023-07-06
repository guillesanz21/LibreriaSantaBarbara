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
import { Customer } from './entities/customer.entity';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { DestructureUser } from '../interceptors/destructure-user.interceptor';
import { RolesEnum } from '../roles/roles.enum';
import { NullableType } from 'src/utils/types/nullable.type';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { CustomerResponseSchema } from '../../utils/schemas/users.schema';

@ApiTags('Users/Customers')
@ApiExtraModels(Customer)
@ApiUnauthorizedResponse({
  description: 'The admin is not logged in.',
})
@ApiForbiddenResponse({
  description: "The user hasn't the right role (admin).",
})
@ApiBearerAuth()
@Roles(RolesEnum.admin)
@Controller()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  // * ######  POST /users/customers ######
  @ApiOperation({
    summary: 'Create a new customer',
    description: 'Create a new customer.',
  })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    schema: CustomerResponseSchema,
  })
  @ApiUnprocessableEntityResponse({
    description: 'The email is not valid.',
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreateCustomerDto): Promise<Customer> {
    return this.customersService.create(body);
  }

  // * ######  GET /users/customers ######
  @ApiOperation({
    summary: 'Get all the customers by filtering them',
    description: 'Get all the filtered customers',
  })
  @ApiQuery({ name: 'email', required: false })
  @ApiQuery({ name: 'NIF', required: false })
  @ApiQuery({ name: 'first-name', required: false })
  @ApiQuery({ name: 'last-name', required: false })
  @ApiQuery({ name: 'address', required: false })
  @ApiQuery({ name: 'phone', required: false })
  @ApiQuery({
    name: 'role',
    description:
      'Role (1: Admin, 2: Store, 3: Customer, 4: Unapproved Store, 5: Unapproved Customer, 6: Guest)',
    required: false,
    enum: RolesEnum,
  })
  @ApiQuery({ name: 'email-confirmed', required: false })
  @ApiOkResponse({
    description: 'The records have been successfully retrieved.',
    schema: {
      type: 'array',
      items: CustomerResponseSchema,
    },
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @DestructureUser()
  @Get()
  @HttpCode(HttpStatus.OK)
  findMany(
    @Query('email') email?: string,
    @Query('NIF') NIF?: string,
    @Query('first-name') first_name?: string,
    @Query('last-name') last_name?: string,
    @Query('address') address?: string,
    @Query('phone') phone_number?: string,
    @Query('role') role?: string,
    @Query('email-confirmed') email_confirmed?: boolean,
  ): Promise<Customer[]> {
    return this.customersService.findMany({
      email,
      NIF,
      first_name,
      last_name,
      address,
      phone_number,
      email_confirmed,
      role,
    });
  }

  // * ######  GET /users/customers/pagination ######
  @ApiOperation({
    summary: 'Get all the customers by filtering them (with pagination)',
    description: 'Get all the filtered customers (with pagination).',
  })
  @ApiQuery({ name: 'page', description: 'Page number', required: true })
  @ApiQuery({ name: 'limit', description: 'Results/page', required: true })
  @ApiQuery({ name: 'email', required: false })
  @ApiQuery({ name: 'NIF', required: false })
  @ApiQuery({ name: 'first-name', required: false })
  @ApiQuery({ name: 'last-name', required: false })
  @ApiQuery({ name: 'address', required: false })
  @ApiQuery({ name: 'phone', required: false })
  @ApiQuery({
    name: 'role',
    description:
      'Role (1: Admin, 2: Store, 3: Customer, 4: Unapproved Store, 5: Unapproved Customer, 6: Guest)',
    required: false,
    enum: RolesEnum,
  })
  @ApiQuery({ name: 'email-confirmed', required: false })
  @ApiOkResponse({
    description: 'The records have been successfully retrieved.',
    schema: {
      allOf: [
        {
          properties: {
            data: {
              type: 'array',
              items: CustomerResponseSchema,
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
  @DestructureUser()
  @Get('/pagination')
  @HttpCode(HttpStatus.OK)
  async findManyWithPagination(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('email') email?: string,
    @Query('NIF') NIF?: string,
    @Query('first-name') first_name?: string,
    @Query('last-name') last_name?: string,
    @Query('address') address?: string,
    @Query('phone') phone_number?: string,
    @Query('role') role?: string,
    @Query('email-confirmed') email_confirmed?: boolean,
  ): Promise<InfinityPaginationResultType<Customer>> {
    if (limit > 50) {
      limit = 50;
    }
    return infinityPagination(
      await this.customersService.findManyWithPagination(
        {
          email,
          NIF,
          first_name,
          last_name,
          address,
          phone_number,
          email_confirmed,
          role,
        },
        {
          page,
          limit,
        },
      ),
      { page, limit },
    );
  }

  // * ######  GET /users/customers/:id ######
  @ApiOperation({
    summary: 'Get a customer by ID',
    description: 'Get the specified customer by its ID (customer_id).',
  })
  @ApiOkResponse({
    description: 'The record has been successfully retrieved.',
    schema: CustomerResponseSchema,
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @DestructureUser()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number): Promise<NullableType<Customer>> {
    const customer = await this.customersService.findOne({ id: +id });
    if (!customer) {
      throw new NotFoundException('customer not found');
    }
    return customer;
  }

  // * ######  PATCH /users/customers/:id ######
  @ApiOperation({
    summary: 'Update a customer.',
    description:
      'Update the specified customer by its ID (customer_id) with the specified data.',
  })
  @ApiOkResponse({
    description: 'The record has been successfully updated.',
  })
  @ApiUnprocessableEntityResponse({
    description: 'The email is not valid.',
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: number,
    @Body() body: UpdateCustomerDto,
  ): Promise<void> {
    const result = await this.customersService.update(id, body);
    if (!result) {
      throw new NotFoundException('customer not found');
    }
  }

  // * ######  DELETE /users/customers/:id ######
  @ApiOperation({
    summary: 'Delete a customer',
    description: 'Delete the specified customer by its ID (customer_id).',
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
      result = await this.customersService.hardDelete(id);
    } else {
      result = await this.customersService.softDelete(id);
    }
    if (!result) {
      throw new NotFoundException('customer not found');
    }
  }

  // * ######  PATCH /users/customers/:id/restore ######
  @ApiOperation({
    summary: 'Restore a customer',
    description:
      'Restore a soft deleted customer specified  by its ID (customer_id).',
  })
  @ApiNoContentResponse({
    description: 'The record has been successfully restored.',
  })
  @Patch(':id/restore')
  @HttpCode(HttpStatus.NO_CONTENT)
  async restore(@Param('id') id: number): Promise<void> {
    const result = await this.customersService.restore(id);
    if (!result) {
      throw new NotFoundException('customer not found');
    }
  }
}
