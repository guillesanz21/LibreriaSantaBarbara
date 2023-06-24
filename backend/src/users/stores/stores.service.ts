import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCRUDService } from 'src/utils/services/base-CRUD.service';
import { Store } from './entities/store.entity';

@Injectable()
export class StoresService extends BaseCRUDService<Store> {
  constructor(
    @InjectRepository(Store) protected repository: Repository<Store>,
  ) {
    super(repository);
  }
}
