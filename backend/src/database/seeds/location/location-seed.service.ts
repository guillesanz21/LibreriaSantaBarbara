import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from 'src/books/locations/entities/location.entity';

@Injectable()
export class LocationSeedService {
  constructor(
    @InjectRepository(Location)
    private repository: Repository<Location>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (count === 0) {
      await this.repository.save(
        this.repository.create({
          store_id: 1,
          location: 'Warehouse',
        }),
      );
      await this.repository.save(
        this.repository.create({
          store_id: 1,
          location: 'Bookstore',
        }),
      );
      await this.repository.save(
        this.repository.create({
          store_id: 1,
          location: 'House',
        }),
      );
    }
  }
}
