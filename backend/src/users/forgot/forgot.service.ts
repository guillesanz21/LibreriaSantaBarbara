import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Forgot } from './entities/forgot.entity';
import { BaseCRUDService } from 'src/utils/services/base-CRUD.service';

@Injectable()
export class ForgotService extends BaseCRUDService<Forgot> {
  constructor(
    @InjectRepository(Forgot) protected readonly repository: Repository<Forgot>,
  ) {
    super(repository);
  }
}
