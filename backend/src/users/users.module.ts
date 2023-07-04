import { RouterModule } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersModule } from './customers/customers.module';
import { StoresModule } from './stores/stores.module';
import { ForgotModule } from './forgot/forgot.module';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

const routes = [
  {
    path: 'admin',
    children: [
      {
        path: 'customers',
        module: CustomersModule,
      },
      {
        path: 'stores',
        module: StoresModule,
      },
    ],
  },
];

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CustomersModule,
    StoresModule,
    ForgotModule,
    RouterModule.register(routes),
  ],
  exports: [UsersService],
  providers: [UsersService],
  controllers: [],
})
export class UsersModule {}
