import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Store])],
  exports: [StoresService],
  providers: [StoresService],
  controllers: [StoresController],
})
export class StoresModule {}
