import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User_Type } from 'src/users/user-types/entities/user_type.entity';
import { UserTypeSeedService } from './user-type-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([User_Type])],
  providers: [UserTypeSeedService],
  exports: [UserTypeSeedService],
})
export class UserTypeSeedModule {}
