import { RouterModule } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { JWTModule } from './jwt/jwt.module';

const routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'email',
        module: JWTModule,
      },
      // More strategies can be added here...
    ],
  },
];

@Module({
  imports: [JWTModule, RouterModule.register(routes)],
  providers: [],
  exports: [],
})
export class AuthModule {}
