import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { BaseCRUDService } from 'src/utils/services/base-CRUD.service';
import { CreateUserAdminDto } from './dtos/create-user.admin.dto';
import { UpdateUserAdminDto } from './dtos/update-user.admin.dto';
import { hashPassword } from 'src/utils/hash-password';

@Injectable()
export class UsersService extends BaseCRUDService<User> {
  constructor(
    @InjectRepository(User) protected readonly repository: Repository<User>,
    private configService: ConfigService,
  ) {
    super(repository);
  }

  private async hashPassword(password: string): Promise<string> {
    const pepper = this.configService.get('auth.pepper', { infer: true });
    const saltRounds = this.configService.get('auth.salt_rounds', {
      infer: true,
    });
    return await hashPassword(password, pepper, +saltRounds);
  }

  // * [C] Create methods
  async create(userDto: CreateUserAdminDto): Promise<User> {
    userDto.password = await this.hashPassword(userDto.password);
    return this.repository.save(this.repository.create(userDto));
  }

  // * [U] Update methods
  // Override the update method from the BaseCRUDService
  async update(user_id: number, payload: UpdateUserAdminDto): Promise<User> {
    if (payload.password) {
      payload.password = await this.hashPassword(payload.password);
    }

    return this.repository.save(
      this.repository.create({
        id: user_id,
        ...payload,
      }),
    );
  }
}
