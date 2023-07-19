import { Module } from '@nestjs/common';
import { ImportExportService } from './import-export.service';
import { ImportExportBooksController } from './import-export.books.controller';

@Module({
  providers: [ImportExportService],
  controllers: [ImportExportBooksController],
})
export class ImportExportModule {}
