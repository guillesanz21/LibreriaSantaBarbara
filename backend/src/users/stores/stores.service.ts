import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { BaseCRUDService } from 'src/utils/services/base-CRUD.service';
import { hashPassword } from 'src/utils/hash-password';

@Injectable()
export class StoresService extends BaseCRUDService<Store> {
  constructor(
    @InjectRepository(Store) protected readonly repository: Repository<Store>,
    private configService: ConfigService,
  ) {
    super(repository);
  }

  // Override create method
  async create(body: DeepPartial<Store>): Promise<Store> {
    const pepper = this.configService.get('constants.pepper', { infer: true });
    const saltRounds = this.configService.get('constants.salt_rounds', {
      infer: true,
    });
    const hashedPassword = await hashPassword(
      body.password,
      pepper,
      +saltRounds,
    );
    body.password = hashedPassword;
    return this.repository.save(this.repository.create(body));
  }
}
