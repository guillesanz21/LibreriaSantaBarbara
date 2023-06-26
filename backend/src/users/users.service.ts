import { Injectable } from '@nestjs/common';
import { DeepPartial, FindOptionsWhere } from 'typeorm';
import { StoresService } from './stores/stores.service';
import { CustomersService } from './customers/customers.service';
import { User, UserType } from './users.types';
import { NullableType } from 'src/utils/types/nullable.type';

@Injectable()
export class UsersService {
  constructor(
    private readonly storesService: StoresService,
    private readonly customersService: CustomersService,
  ) {}

  // Create user
  // CHECK: It is calling the DTOs from the stores and customers modules?
  // IF not, then, how conditionally call the DTOs?
  async create(
    type: UserType,
    data: Partial<User>,
  ): Promise<NullableType<User>> {
    if (type === 'store') {
      return await this.storesService.create(data);
    }
    if (type === 'customer') {
      return await this.customersService.create(data);
    }
  }

  // Find user by field (id, email, etc.)
  async findOne(
    type: UserType,
    fields: FindOptionsWhere<User>,
  ): Promise<NullableType<User>> {
    if (type === 'store') {
      return await this.storesService.findOne(fields);
    }
    if (type === 'customer') {
      return await this.customersService.findOne(fields);
    }
  }

  // Update
  async update(
    type: UserType,
    id: number,
    data: DeepPartial<User>,
  ): Promise<User> {
    if (type === 'store') {
      return await this.storesService.update(id, data);
    }
    if (type === 'customer') {
      return await this.customersService.update(id, data);
    }
  }

  // Soft Delete
  async softDelete(type: UserType, id: number): Promise<boolean> {
    if (type === 'store') {
      return await this.storesService.softDelete(id);
    }
    if (type === 'customer') {
      return await this.customersService.softDelete(id);
    }
  }
}
