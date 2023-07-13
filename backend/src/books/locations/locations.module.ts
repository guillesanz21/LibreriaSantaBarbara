import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location as LocationEntity } from './entities/location.entity';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LocationEntity])],
  providers: [LocationsService],
  controllers: [LocationsController],
})
export class LocationsModule {}
