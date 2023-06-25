import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { IsUniqueConstraint } from 'src/utils/validators/isUnique.validator';

@Module({
  imports: [TypeOrmModule.forFeature([Store])],
  exports: [StoresService],
  providers: [IsUniqueConstraint, StoresService],
  controllers: [StoresController],
})
export class StoresModule {}
