import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from 'src/books/books/books.module';
import { Book } from 'src/books/books/entities/book.entity';
import { ImportExportService } from './import-export.service';
import { ImportExportBooksController } from './import-export.books.controller';

@Module({
  imports: [BooksModule, TypeOrmModule.forFeature([Book])],
  providers: [ImportExportService],
  controllers: [ImportExportBooksController],
})
export class ImportExportModule {}
