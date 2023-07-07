import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { RolesEnum } from 'src/users/roles/roles.enum';
import { UserTypesEnum } from 'src/users/user-types/user_types.enum';
import { hashPassword } from 'src/utils/hash-password';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
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
      console.log('DELETE: ppeper');
      console.log(pepper);
      console.log('DELETE: saltrounds');
      console.log(saltRounds);
      const hashedPassword = await hashPassword('admin', pepper, +saltRounds);

      await this.repository.save(
        this.repository.create({
          email: 'admin@admin.com',
          password: hashedPassword,
          role_id: RolesEnum.admin,
          user_type_id: UserTypesEnum.admin,
        }),
      );
    }
  }
}
