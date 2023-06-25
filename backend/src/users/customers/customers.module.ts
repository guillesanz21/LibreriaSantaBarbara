import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { IsUniqueConstraint } from 'src/utils/validators/isUnique.validator';

@Module({
  imports: [TypeOrmModule.forFeature([Customer])],
  exports: [CustomersService],
  providers: [IsUniqueConstraint, CustomersService],
  controllers: [CustomersController],
})
export class CustomersModule {}
