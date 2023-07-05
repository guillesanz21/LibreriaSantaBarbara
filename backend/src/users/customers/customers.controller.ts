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

@Roles(RolesEnum.admin)
@Controller()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @SerializeOptions({
    groups: ['admin'],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreateCustomerDto): Promise<Customer> {
    return this.customersService.create(body);
  }

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

  @Patch(':id/restore')
  @HttpCode(HttpStatus.NO_CONTENT)
  async restore(@Param('id') id: number): Promise<void> {
    const result = await this.customersService.restore(id);
    if (!result) {
      throw new NotFoundException('customer not found');
    }
  }
}
