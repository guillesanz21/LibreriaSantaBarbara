import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User_Type } from 'src/users/user-types/entities/user_type.entity';
import { UserTypesEnum } from 'src/users/user-types/user_types.enum';

@Injectable()
export class UserTypeSeedService {
  constructor(
    @InjectRepository(User_Type)
    private repository: Repository<User_Type>,
  ) {}

  async run() {
    const countAdmin = await this.repository.count({
      where: { id: UserTypesEnum.admin },
    });
    if (!countAdmin) {
      await this.repository.save(
        this.repository.create({
          id: UserTypesEnum.admin,
          user_type: UserTypesEnum[UserTypesEnum.admin],
        }),
      );
    }

    const countStore = await this.repository.count({
      where: { id: UserTypesEnum.store },
    });
    if (!countStore) {
      await this.repository.save(
        this.repository.create({
          id: UserTypesEnum.store,
          user_type: UserTypesEnum[UserTypesEnum.store],
        }),
      );
    }

    const countCustomer = await this.repository.count({
      where: { id: UserTypesEnum.customer },
    });
    if (!countCustomer) {
      await this.repository.save(
        this.repository.create({
          id: UserTypesEnum.customer,
          user_type: UserTypesEnum[UserTypesEnum.customer],
        }),
      );
    }
  }
}
