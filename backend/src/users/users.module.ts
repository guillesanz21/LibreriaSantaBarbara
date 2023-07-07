import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersModule } from './customers/customers.module';
import { StoresModule } from './stores/stores.module';
import { ForgotModule } from './forgot/forgot.module';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CustomersModule,
    StoresModule,
    ForgotModule,
  ],
  exports: [UsersService],
  providers: [UsersService, AdminService],
  controllers: [AdminController],
})
export class UsersModule {}
