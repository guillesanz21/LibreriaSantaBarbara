import { Injectable } from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { FindOptionsWhere } from 'typeorm';
import { EntityHelper } from '../entities/entity-helper.entity';
import { NullableType } from 'src/utils/types/nullable.type';
import { IPaginationOptions } from 'src/utils/types/paginations-options.interface';

@Injectable()
export class BaseCRUDService<InjectedEntity extends EntityHelper> {
  constructor(protected readonly repository: Repository<InjectedEntity>) {}

  // * [C] Create
  create(body: DeepPartial<InjectedEntity>): Promise<InjectedEntity> {
    return this.repository.save(this.repository.create(body));
  }

  // * [R] Read
  // Find one
  findOne(
    fields: FindOptionsWhere<InjectedEntity>,
  ): Promise<NullableType<InjectedEntity>> {
    return this.repository.findOne({
      where: fields,
    });
  }

  // Find many without pagination
  findMany(
    fields: FindOptionsWhere<InjectedEntity>,
  ): Promise<NullableType<InjectedEntity[]>> {
    return this.repository.find({
      where: fields,
    });
  }

  // Find many with pagination
  findManyWithPagination(
    fields: FindOptionsWhere<InjectedEntity>,
    paginationOptions: IPaginationOptions,
  ): Promise<InjectedEntity[]> {
    return this.repository.find({
      where: fields,
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });
  }

  // * [U] Update methods
  update(
    id: number,
    payload: DeepPartial<InjectedEntity>,
  ): Promise<InjectedEntity> {
    return this.repository.save(
      this.repository.create({
        id,
        ...payload,
      }),
    );
  }

  // * [D] Delete methods
  // Hard delete
  async hardDelete(id: number): Promise<void> {
    // We use delete if we don't have any hooks or any other logic to run. Otherwise, we should use remove.
    await this.repository.delete(id);
  }

  // Soft delete
  async softDelete(id: number): Promise<void> {
    await this.repository.softDelete(id);
  }

  // Restore
  async restore(id: number): Promise<void> {
    await this.repository.restore(id);
  }
}
