import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../roles/entities/role.entity';
import { User_Type } from '../user-types/entities/user_type.entity';
import { User } from '../entities/user.entity';
import { Store } from './entities/store.entity';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { IsUniqueConstraint } from 'src/utils/validators/isUnique.validator';
import { IsCompositeUniqueConstraint } from 'src/utils/validators/isCompositeUnique.validator';

@Module({
  imports: [TypeOrmModule.forFeature([Role, User_Type, User, Store])],
  exports: [StoresService],
  providers: [IsUniqueConstraint, IsCompositeUniqueConstraint, StoresService],
  controllers: [StoresController],
})
export class StoresModule {}
