import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Location as LocationEntity } from './entities/location.entity';
import { CreateLocationDto } from './dtos/create-location.dto';
import { UpdateLocationDto } from './dtos/update-location.dto';
import { Repository } from 'typeorm';
import { NullableType } from 'src/utils/types/nullable.type';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(LocationEntity)
    protected readonly repository: Repository<LocationEntity>,
  ) {}

  // * [C] Create
  create(store_id: number, body: CreateLocationDto): Promise<LocationEntity> {
    return this.repository.save(this.repository.create({ store_id, ...body }));
  }

  // * [R] Read
  // Find one
  findOne(store_id: number, id: number): Promise<NullableType<LocationEntity>> {
    return this.repository.findOne({ where: { store_id, id } });
  }

  // Find many without pagination
  findMany(store_id: number): Promise<NullableType<LocationEntity[]>> {
    return this.repository.find({
      where: { store_id },
    });
  }

  // * [U] Update methods
  update(
    store_id: number,
    id: number,
    payload: UpdateLocationDto,
  ): Promise<LocationEntity> {
    return this.repository.save(
      this.repository.create({
        id,
        store_id,
        ...payload,
      }),
    );
  }

  // * [D] Delete methods
  // Hard delete
  async hardDelete(store_id: number, id: number): Promise<string> {
    const location = await this.findOne(store_id, id);
    if (!location) {
      return 'NotFound';
    }
    const deleteResult = await this.repository.delete(id);
    return deleteResult.affected > 0 ? 'Deleted' : 'NotDeleted';
  }
}
