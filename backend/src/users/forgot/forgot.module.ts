import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Forgot } from './entities/forgot.entity';
import { ForgotService } from './forgot.service';

@Module({
  imports: [TypeOrmModule.forFeature([Forgot])],
  exports: [ForgotService],
  providers: [ForgotService],
})
export class ForgotModule {}
