import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { BaseCRUDService } from 'src/utils/services/base-CRUD.service';
import { hashPassword } from 'src/utils/hash-password';

@Injectable()
export class CustomersService extends BaseCRUDService<Customer> {
  constructor(
    @InjectRepository(Customer)
    protected readonly repository: Repository<Customer>,
    private configService: ConfigService,
  ) {
    super(repository);
  }

  // Override create method
  async create(body: DeepPartial<Customer>): Promise<Customer> {
    const pepper = this.configService.get('constants.pepper', { infer: true });
    const hashedPassword = await hashPassword(body.password, pepper);
    body.password = hashedPassword;
    return this.repository.save(this.repository.create(body));
  }
}
