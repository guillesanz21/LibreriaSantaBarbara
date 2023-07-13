import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Store } from 'src/users/stores/entities/store.entity';
import { Customer } from 'src/users/customers/entities/customer.entity';
import { RolesEnum } from 'src/users/roles/roles.enum';
import { UserTypesEnum } from 'src/users/user-types/user_types.enum';
import { hashPassword } from 'src/utils/hash-password';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private configService: ConfigService,
  ) {}

  async run() {
    const countAdmin = await this.repository.count({
      where: {
        role: {
          id: RolesEnum.admin,
        },
      },
    });
    if (!countAdmin) {
      const pepper = this.configService.get('auth.pepper', { infer: true });
      const saltRounds = this.configService.get('auth.salt_rounds', {
        infer: true,
      });
      const hashedPassword = await hashPassword('admin', pepper, +saltRounds);

      await this.repository.save(
        this.repository.create({
          id: 1,
          email: 'admin@admin.com',
          password: hashedPassword,
          role_id: RolesEnum.admin,
          user_type_id: UserTypesEnum.admin,
          email_confirmed: true,
        }),
      );
    }

    const countStore = await this.repository.count({
      where: {
        role: {
          id: RolesEnum.store,
        },
      },
    });
    if (!countStore) {
      const pepper = this.configService.get('auth.pepper', { infer: true });
      const saltRounds = this.configService.get('auth.salt_rounds', {
        infer: true,
      });
      const hashedPassword = await hashPassword('test', pepper, +saltRounds);

      await this.repository.save(
        this.repository.create({
          id: 2,
          email: 'store@store.com',
          password: hashedPassword,
          role_id: RolesEnum.store,
          user_type_id: UserTypesEnum.store,
          email_confirmed: true,
        }),
      );
      await this.storeRepository.save(
        this.storeRepository.create({
          user_id: 2,
          name: 'Test Store',
          approved: true,
        }),
      );
    }

    const countCustomer = await this.repository.count({
      where: {
        role: {
          id: RolesEnum.customer,
        },
      },
    });
    if (!countCustomer) {
      const pepper = this.configService.get('auth.pepper', { infer: true });
      const saltRounds = this.configService.get('auth.salt_rounds', {
        infer: true,
      });
      const hashedPassword = await hashPassword('test', pepper, +saltRounds);

      await this.repository.save(
        this.repository.create({
          id: 3,
          email: 'customer@customer.com',
          password: hashedPassword,
          role_id: RolesEnum.customer,
          user_type_id: UserTypesEnum.customer,
          email_confirmed: true,
        }),
      );
      await this.customerRepository.save(
        this.customerRepository.create({
          user_id: 3,
          first_name: 'Philip',
          last_name: 'Parker',
          provider: 'email',
          social_id: null,
        }),
      );
    }
  }
}
