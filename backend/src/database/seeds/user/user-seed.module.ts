import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Store } from 'src/users/stores/entities/store.entity';
import { Customer } from 'src/users/customers/entities/customer.entity';
import { UserSeedService } from './user-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Store, Customer])],
  providers: [UserSeedService],
  exports: [UserSeedService],
})
export class UserSeedModule {}
