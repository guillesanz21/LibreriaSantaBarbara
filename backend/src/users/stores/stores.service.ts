import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { User } from '../entities/user.entity';
import { CreateStoreDto } from './dtos/create-store.dto';
import { UpdateStoreDto } from './dtos/update-store.dto';
import { IPaginationOptions } from 'src/utils/types/paginations-options.interface';
import { NullableType } from 'src/utils/types/nullable.type';
import { UserTypesEnum } from '../user-types/user_types.enum';
import { hashPassword } from 'src/utils/hash-password';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(User) protected readonly userRepository: Repository<User>,
    @InjectRepository(Store) protected readonly repository: Repository<Store>,
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
  async create(storeDto: CreateStoreDto): Promise<Store> {
    storeDto.password = await this.hashPassword(storeDto.password);

    const user = this.userRepository.create({
      user_type_id: UserTypesEnum.store,
      ...storeDto,
    });
    const store = this.repository.create({ user, ...storeDto });
    return this.repository.save(store);
  }

  // * [R] Find methods
  findOne({
    id = null,
    user_id = null,
    email = null,
    NIF = null,
    name = null,
    hash = null,
    address = null,
    phone_number = null,
  }): Promise<NullableType<Store>> {
    const fields = {
      id,
      user_id,
      name,
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
    name = null,
    role = null,
    approved = null,
  }): Promise<NullableType<Store[]>> {
    const fields = {
      name,
      approved,
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
      name = null,
      role = null,
      approved = null,
    },
    paginationOptions: IPaginationOptions,
  ): Promise<NullableType<Store[]>> {
    const fields = {
      name,
      approved,
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
    payload: UpdateStoreDto,
    id_of = 'store',
  ): Promise<Store> {
    let user_id: number;
    let store_id: number;
    if (id_of !== 'user') {
      const user = await this.repository
        .createQueryBuilder()
        .select('user_id')
        .where('id = :id', { id })
        .getRawOne();
      user_id = user.user_id;
      store_id = id;
    } else {
      const store = await this.repository
        .createQueryBuilder()
        .select('id')
        .where('user_id = :id', { id })
        .getRawOne();
      user_id = id;
      store_id = store.id;
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
        id: store_id,
        user,
        ...payload,
      }),
    );
  }

  // * [D] Delete methods
  async hardDelete(id: number, id_of = 'store'): Promise<boolean> {
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

  async softDelete(id: number, id_of = 'store'): Promise<boolean> {
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

  async restore(id: number, id_of = 'store'): Promise<boolean> {
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
