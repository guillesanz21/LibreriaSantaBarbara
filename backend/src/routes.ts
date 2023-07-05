import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { CustomersModule } from './users/customers/customers.module';
import { StoresModule } from './users/stores/stores.module';
import { JWTModule } from './auth/jwt/jwt.module';

export const routes = [
  {
    path: '/',
    children: [
      {
        path: 'users',
        children: [
          {
            path: 'customers',
            module: CustomersModule,
          },
          {
            path: 'stores',
            module: StoresModule,
          },
          {
            path: 'admin',
            module: UsersModule,
          },
        ],
      },
      {
        path: 'auth',
        module: AuthModule,
        children: [
          {
            path: 'email',
            module: JWTModule,
          },
        ],
      },
      {
        path: 'books',
        module: BooksModule,
      },
    ],
  },
];
