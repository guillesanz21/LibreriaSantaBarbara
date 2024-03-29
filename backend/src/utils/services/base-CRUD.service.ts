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
    // relations?: string[],
  ): Promise<NullableType<InjectedEntity>> {
    return this.repository.findOne({
      // relations,
      where: { ...fields },
    });
  }

  // Find many without pagination
  findMany(
    fields: FindOptionsWhere<InjectedEntity>,
    // relations?: string[],
  ): Promise<NullableType<InjectedEntity[]>> {
    return this.repository.find({
      where: fields,
      // relations,
    });
  }

  // Find many with pagination
  findManyWithPagination(
    fields: FindOptionsWhere<InjectedEntity>,
    paginationOptions: IPaginationOptions,
    // relations?: string[],
  ): Promise<InjectedEntity[]> {
    return this.repository.find({
      where: fields,
      // relations,
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
  async hardDelete(id: number): Promise<boolean> {
    // We use delete if we don't have any hooks or any other logic to run. Otherwise, we should use remove.
    const deleteResult = await this.repository.delete(id);
    return deleteResult.affected > 0;
  }

  // Soft delete
  async softDelete(id: number): Promise<boolean> {
    const updateResult = await this.repository.softDelete(id);
    return updateResult.affected > 0;
  }

  // Restore
  async restore(id: number): Promise<boolean> {
    const updateResult = await this.repository.restore(id);
    return updateResult.affected > 0;
  }
}
