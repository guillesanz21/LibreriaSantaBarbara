import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LanguagesModule } from '../languages/languages.module';
import { TopicsModule } from '../topics/topics.module';
import { LocationsModule } from '../locations/locations.module';
import { StatusModule } from '../status/status.module';
import { ImagesModule } from '../images/images.module';
import { KeywordsModule } from '../keywords/keywords.module';
import { StoresModule } from 'src/users/stores/stores.module';
import { Book } from './entities/book.entity';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { BooksAdminController } from './admin.books.controller';
import { BooksPublicController } from './public.books.controller';

@Module({
  imports: [
    LanguagesModule,
    TopicsModule,
    LocationsModule,
    StatusModule,
    ImagesModule,
    KeywordsModule,
    StoresModule,
    TypeOrmModule.forFeature([Book]),
  ],
  providers: [BooksService],
  exports: [BooksService],
  controllers: [BooksPublicController, BooksAdminController, BooksController],
})
export class BooksModule {}
