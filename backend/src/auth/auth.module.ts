import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { JWTModule } from './jwt/jwt.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [JWTModule],
  providers: [
    // Authentication
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Authorization
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [],
})
export class AuthModule {}
