import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { BulkCreateImageDto } from './dtos/create-image.dto';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private readonly imagesRepository: Repository<Image>,
  ) {}

  // * [C] Create
  // Bulk create images from array of names and return the created images
  bulkCreate(images: BulkCreateImageDto[]): Image[] {
    return images.map(({ image }) =>
      this.imagesRepository.create({ url: image }),
    );
  }
}
