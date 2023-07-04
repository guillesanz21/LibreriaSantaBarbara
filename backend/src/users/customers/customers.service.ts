import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { User } from '../entities/user.entity';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { IPaginationOptions } from 'src/utils/types/paginations-options.interface';
import { NullableType } from 'src/utils/types/nullable.type';
import { UserTypesEnum } from '../user-types/user_types.enum';
import { hashPassword } from 'src/utils/hash-password';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    protected readonly repository: Repository<Customer>,
    @InjectRepository(User) protected readonly userRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const pepper = this.configService.get('auth.pepper', { infer: true });
    const saltRounds = this.configService.get('auth.salt_rounds', {
      infer: true,
    });
    return await hashPassword(password, pepper, +saltRounds);
  }

  // * [C] Create methods
  async create(customerDto: CreateCustomerDto): Promise<Customer> {
    if (customerDto.password) {
      customerDto.password = await this.hashPassword(customerDto.password);
    }

    const user = await this.userRepository.save(
      this.userRepository.create({
        user_type_id: UserTypesEnum.customer,
        ...customerDto,
      }),
    );
    return this.repository.save(
      this.repository.create({ user, ...customerDto }),
    );
  }

  // * [R] Find methods
  findOne({
    id = null,
    user_id = null,
    email = null,
    NIF = null,
    hash = null,
    address = null,
    phone_number = null,
    provider = null,
    social_id = null,
  }): Promise<NullableType<Customer>> {
    const fields = {
      id,
      user_id,
      provider,
      social_id,
      user: {
        email,
        NIF,
        hash,
        address,
        phone_number,
        id: Not(IsNull()),
        deleted_at: IsNull(),
      },
    };
    return this.repository.findOne({
      where: fields,
      relations: ['user'],
    });
  }

  findMany({
    email = null,
    NIF = null,
    address = null,
    phone_number = null,
    first_name = null,
    last_name = null,
    role = null,
    email_confirmed = null,
  }): Promise<NullableType<Customer[]>> {
    const fields = {
      first_name,
      last_name,
      email_confirmed,
      user: {
        email,
        NIF,
        address,
        phone_number,
        role: { role },
        id: Not(IsNull()),
        deleted_at: IsNull(),
      },
    };
    return this.repository.find({
      where: fields,
      relations: ['user'],
    });
  }

  findManyWithPagination(
    {
      email = null,
      NIF = null,
      address = null,
      phone_number = null,
      first_name = null,
      last_name = null,
      role = null,
      email_confirmed = null,
    },
    paginationOptions: IPaginationOptions,
  ): Promise<NullableType<Customer[]>> {
    const fields = {
      first_name,
      last_name,
      email_confirmed,
      user: {
        email,
        NIF,
        address,
        phone_number,
        role: { role },
        id: Not(IsNull()),
        deleted_at: IsNull(),
      },
    };
    return this.repository.find({
      where: fields,
      relations: ['user'],
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });
  }

  // * [U] Update methods
  async update(
    id: number,
    payload: UpdateCustomerDto,
    id_of = 'customer',
  ): Promise<Customer> {
    let user_id: number;
    let customer_id: number;
    if (id_of !== 'user') {
      const user = await this.repository
        .createQueryBuilder()
        .select('user_id')
        .where('id = :id', { id })
        .getRawOne();
      user_id = user.user_id;
      customer_id = id;
    } else {
      const customer = await this.repository
        .createQueryBuilder()
        .select('id')
        .where('user_id = :id', { id })
        .getRawOne();
      user_id = id;
      customer_id = customer.id;
    }
    if (payload.password) {
      payload.password = await this.hashPassword(payload.password);
    }

    const user = this.userRepository.create({
      id: user_id,
      ...payload,
    });
    return this.repository.save(
      this.repository.create({
        id: customer_id,
        user,
        ...payload,
      }),
    );
  }

  // * [D] Delete methods
  async hardDelete(id: number, id_of = 'customer'): Promise<boolean> {
    let user_id: number;
    if (id_of !== 'user') {
      const user = await this.repository
        .createQueryBuilder()
        .select('user_id')
        .where('id = :id', { id })
        .getRawOne();
      user_id = user.user_id;
    } else {
      user_id = id;
    }
    // We use delete if we don't have any hooks or any other logic to run. Otherwise, we should use remove.
    const deleteResult = await this.userRepository.delete(user_id);
    return deleteResult.affected > 0;
  }

  async softDelete(id: number, id_of = 'customer'): Promise<boolean> {
    let user_id: number;
    if (id_of !== 'user') {
      const user = await this.repository
        .createQueryBuilder()
        .select('user_id')
        .where('id = :id', { id })
        .getRawOne();
      user_id = user.user_id;
    } else {
      user_id = id;
    }
    const deleteResult = await this.userRepository.softDelete(user_id);
    return Boolean(deleteResult);
  }

  async restore(id: number, id_of = 'customer'): Promise<boolean> {
    let user_id: number;
    if (id_of !== 'user') {
      const user = await this.repository
        .createQueryBuilder()
        .select('user_id')
        .where('id = :id', { id })
        .getRawOne();
      user_id = user.user_id;
    } else {
      user_id = id;
    }
    const deleteResultUser = await this.userRepository.restore(user_id);
    return deleteResultUser.affected > 0;
  }
}
