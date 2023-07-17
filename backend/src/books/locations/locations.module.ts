import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location as LocationEntity } from './entities/location.entity';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { StoresModule } from 'src/users/stores/stores.module';

@Module({
  imports: [StoresModule, TypeOrmModule.forFeature([LocationEntity])],
  providers: [LocationsService],
  controllers: [LocationsController],
})
export class LocationsModule {}
