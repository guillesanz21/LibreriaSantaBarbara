import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { JWTService } from './jwt.service';
import { JwtController } from './jwt.controller';
import { IsExistsConstraint } from 'src/utils/validators/isExists.validator';
import { IsUniqueConstraint } from 'src/utils/validators/isUnique.validator';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule,
    NestJwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('auth.jwt_secret'),
        signOptions: {
          expiresIn: configService.get('auth.jwt_expires'),
        },
      }),
    }),
  ],
  providers: [IsExistsConstraint, IsUniqueConstraint, JWTService, JwtStrategy],
  controllers: [JwtController],
})
export class JWTModule {}
