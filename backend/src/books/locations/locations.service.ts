import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Location as LocationEntity } from './entities/location.entity';
import { StoresService } from 'src/users/stores/stores.service';
import { CreateLocationDto } from './dtos/create-location.dto';
import { UpdateLocationDto } from './dtos/update-location.dto';
import { Repository } from 'typeorm';
import { NullableType } from 'src/utils/types/nullable.type';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(LocationEntity)
    protected readonly repository: Repository<LocationEntity>,
    private readonly storesService: StoresService,
  ) {}

  private async getStoreId(user_id: number): Promise<string | number> {
    const store = await this.storesService.findOne({ user_id });
    if (!store) {
      return 'NotFound';
    }
    return store.id;
  }

  // * [C] Create
  async create(
    user_id: number,
    body: CreateLocationDto,
  ): Promise<string | LocationEntity> {
    const store_id = await this.getStoreId(user_id);
    if (typeof store_id === 'string') store_id;
    const createdLocation = await this.repository.insert(
      this.repository.create({ store_id: +store_id, ...body }),
    );
    return createdLocation.raw;
  }

  // * [R] Read
  // Find one
  async findOne(
    user_id: number,
    id: number,
  ): Promise<NullableType<string | LocationEntity>> {
    const store_id = await this.getStoreId(user_id);
    if (typeof store_id === 'string') store_id;
    return this.repository.findOne({ where: { store_id: +store_id, id } });
  }

  // Find many without pagination
  async findMany(
    user_id: number,
  ): Promise<NullableType<string | LocationEntity[]>> {
    const store_id = await this.getStoreId(user_id);
    if (typeof store_id === 'string') store_id;
    return this.repository.find({
      where: { store_id: +store_id },
    });
  }

  // * [U] Update methods
  async update(
    user_id: number,
    id: number,
    payload: UpdateLocationDto,
  ): Promise<string> {
    const store_id = await this.getStoreId(user_id);
    if (typeof store_id === 'string') store_id;
    const result = await this.repository.update(id, {
      store_id: +store_id,
      ...payload,
    });
    return result.affected > 0 ? 'Updated' : 'NotUpdated';
  }

  // * [D] Delete methods
  // Hard delete
  async hardDelete(user_id: number, id: number): Promise<string> {
    const store_id = await this.getStoreId(user_id);
    if (typeof store_id === 'string') store_id;
    const location = await this.findOne(+store_id, id);
    if (!location) {
      return 'NotFound';
    }
    const deleteResult = await this.repository.delete(id);
    return deleteResult.affected > 0 ? 'Deleted' : 'NotDeleted';
  }
}
