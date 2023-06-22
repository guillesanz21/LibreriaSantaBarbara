import { Module } from '@nestjs/common';
import { LanguagesModule } from './languages/languages.module';
import { TopicsModule } from './topics/topics.module';
import { LocationsModule } from './locations/locations.module';
import { StatusModule } from './status/status.module';

@Module({
  imports: [LanguagesModule, TopicsModule, LocationsModule, StatusModule],
})
export class BooksModule {}
