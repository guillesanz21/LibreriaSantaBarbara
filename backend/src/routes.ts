import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books/books.module';
import { CustomersModule } from './users/customers/customers.module';
import { StoresModule } from './users/stores/stores.module';
import { JWTModule } from './auth/jwt/jwt.module';
import { LanguagesModule } from './books/languages/languages.module';
import { TopicsModule } from './books/topics/topics.module';
import { LocationsModule } from './books/locations/locations.module';
import { StatusModule } from './books/status/status.module';
import { BooksGlobalModule } from './books/books-global.module';
import { ImportExportModule } from './import-export/import-export.module';

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
        module: BooksGlobalModule,
        children: [
          {
            path: 'languages',
            module: LanguagesModule,
          },
          {
            path: 'topics',
            module: TopicsModule,
          },
          {
            path: 'locations',
            module: LocationsModule,
          },
          {
            path: 'status',
            module: StatusModule,
          },
          {
            path: '/',
            module: BooksModule,
          },
        ],
      },
      {
        // This routes are defined inside the controller
        path: '',
        module: ImportExportModule,
      },
    ],
  },
];
