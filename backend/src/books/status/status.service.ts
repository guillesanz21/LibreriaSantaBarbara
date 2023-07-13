import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status } from './entities/status.entity';
import { BaseCRUDService } from 'src/utils/services/base-CRUD.service';

@Injectable()
export class StatusService extends BaseCRUDService<Status> {
  constructor(
    @InjectRepository(Status)
    protected readonly repository: Repository<Status>,
  ) {
    super(repository);
  }
}
