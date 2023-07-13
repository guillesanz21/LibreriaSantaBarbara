import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from 'src/books/locations/entities/location.entity';
import { LocationSeedService } from './location-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Location])],
  providers: [LocationSeedService],
  exports: [LocationSeedService],
})
export class LocationSeedModule {}
