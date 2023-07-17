import { Module } from '@nestjs/common';
import { LanguagesModule } from './languages/languages.module';
import { TopicsModule } from './topics/topics.module';
import { LocationsModule } from './locations/locations.module';
import { StatusModule } from './status/status.module';
import { ImagesModule } from './images/images.module';
import { KeywordsModule } from './keywords/keywords.module';
import { StoresModule } from 'src/users/stores/stores.module';
import { BooksModule } from './books/books.module';

@Module({
  imports: [
    LanguagesModule,
    TopicsModule,
    LocationsModule,
    StatusModule,
    ImagesModule,
    KeywordsModule,
    StoresModule,
    BooksModule,
  ],
  providers: [],
  controllers: [],
})
export class BooksGlobalModule {}
