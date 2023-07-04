import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Customer } from './entities/customer.entity';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { IsUniqueConstraint } from 'src/utils/validators/isUnique.validator';
import { IsCompositeUniqueConstraint } from 'src/utils/validators/isCompositeUnique.validator';

@Module({
  imports: [TypeOrmModule.forFeature([User, Customer])],
  exports: [CustomersService],
  providers: [
    IsUniqueConstraint,
    IsCompositeUniqueConstraint,
    CustomersService,
  ],
  controllers: [CustomersController],
})
export class CustomersModule {}
