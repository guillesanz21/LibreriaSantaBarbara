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
  // UseGuards,
} from '@nestjs/common';
import { Customer } from './entities/customer.entity';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { DestructureUser } from '../interceptors/destructure-user.interceptor';
import { NullableType } from 'src/utils/types/nullable.type';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { infinityPagination } from 'src/utils/infinity-pagination';
// import { Roles } from '../roles/roles.decorator';
// import { RolesEnum } from '../roles/roles.enum';
// import { AuthGuard } from '@nestjs/passport';
// import { RolesGuard } from '../roles/roles.guard';

// TODO: Refactor to one decorator and uncomment
// @Roles(RolesEnum.admin)
// @UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}
  @Post()
  create(@Body() body: CreateCustomerDto): Promise<Customer> {
    return this.customersService.create(body);
  }

  @DestructureUser()
  @Get()
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

  @DestructureUser()
  @Get('/pagination')
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

  @DestructureUser()
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<NullableType<Customer>> {
    const customer = await this.customersService.findOne({ id: +id });
    if (!customer) {
      throw new NotFoundException('customer not found');
    }
    return customer;
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() body: UpdateCustomerDto,
  ): Promise<Customer> {
    return this.customersService.update(id, body);
  }

  @Delete(':id')
  remove(
    @Param('id') id: number,
    @Query('mode') deleteMode?: string,
  ): Promise<boolean> {
    if (deleteMode && deleteMode === 'hard') {
      return this.customersService.hardDelete(id);
    } else {
      return this.customersService.softDelete(id);
    }
  }

  @Patch(':id/restore')
  restore(@Param('id') id: number): Promise<boolean> {
    return this.customersService.restore(id);
  }
}
