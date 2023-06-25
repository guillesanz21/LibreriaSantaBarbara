import { Injectable } from '@nestjs/common';
import { CustomersService } from './customers/customers.service';
import { StoresService } from './stores/stores.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly customersService: CustomersService,
    private readonly storesService: StoresService,
  ) {}
}
