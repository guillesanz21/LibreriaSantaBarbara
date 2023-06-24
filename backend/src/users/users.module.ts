import { RouterModule } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { CustomersModule } from './customers/customers.module';
import { StoresModule } from './stores/stores.module';

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
  imports: [CustomersModule, StoresModule, RouterModule.register(routes)],
  exports: [UsersService],
  providers: [UsersService],
  controllers: [],
})
export class UsersModule {}
