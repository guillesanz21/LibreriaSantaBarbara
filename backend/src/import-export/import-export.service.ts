import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/books/books/entities/book.entity';
import { BooksService } from 'src/books/books/books.service';
import { parser } from './utils/parser';
import { booksTransformer } from './utils/transformer';
import { FileFormatEnum } from './utils/parser/FileFormat';
import { importFile, exportFile, DataTypeEnum } from './utils/fileSystem';
import { ExtensionFormatEnum } from './utils/fileSystem/ExtensionFormat';
import { UniliberType } from './utils/transformer/fields.types';
import { ImportExportEnum } from './utils/transformer/ImportExportFormat';
import { OwnerEnum } from 'src/users/users.types';

@Injectable()
export class ImportExportService {
  constructor(
    @InjectRepository(Book)
    private readonly booksRepository: typeof Book,
    private readonly booksService: BooksService,
  ) {}

  // * Full Import (Delete all books in database and import)
  async importBooks(
    user_id: number,
    format: FileFormatEnum,
    keywords_to_topics?: boolean,
    clean_description?: boolean,
  ): Promise<string> {
    const format_to = FileFormatEnum.json;
    // 1. Read the file
    const data: string = await importFile('original.txt');

    // 2. Parse the file
    const parsed_file = await parser(data, format, format_to);
    const books: UniliberType[] = parsed_file.data;

    // 3. Transform the file (Adapt the data to the database schema)
    const transformed_books = booksTransformer(
      books,
      ImportExportEnum.uniliber,
      ImportExportEnum.db,
      keywords_to_topics,
      clean_description,
    );
    if (typeof transformed_books === 'string') {
      return transformed_books;
    }

    // 4. Transaction: Delete previous books and save the books in database, or fail.
    const created_books = await this.booksService.bulkCreate(
      user_id,
      OwnerEnum.user,
      transformed_books,
      true,
    );
    if (typeof created_books === 'string') {
      return created_books;
    }

    return created_books ? 'Imported books' : 'Error importing';
  }

  // * Import with conflicts (Compare books in database with the ones in the file and update the ones that have changed)
  // TODO:
  async importBooksWithConflicts() {
    // 1. Read the file
    // 2. Parse the file
    // 3. Adapt the data to the database schema
    // 4. If there are books in database, compare them with the ones in the file
    // 5. Save only the books that are not in database and update the ones that have changed
    return 'Imported books with conflicts';
  }

  // * Delta import (Import with conflicts a selected set of books)
  // TODO:

  // * Export all books to a file
  async exportBooks(
    user_id: number,
    format: FileFormatEnum,
    file_extension: ExtensionFormatEnum,
    file_name: string,
  ): Promise<string> {
    if (
      file_extension === ExtensionFormatEnum.json &&
      format !== FileFormatEnum.json
    ) {
      return 'JSON extension is only available for JSON format';
    }

    // 1. Read the books from database
    const data = await this.booksService.findAll(user_id, OwnerEnum.user);
    if (typeof data === 'string') {
      return data;
    }

    // 2. Transform the books to the file schema
    const transformed_books = booksTransformer(
      data,
      ImportExportEnum.db,
      ImportExportEnum.es,
    );
    if (typeof transformed_books === 'string') {
      return transformed_books;
    }

    // 3. Parse the file
    const parsed_file = await parser(
      transformed_books,
      FileFormatEnum.json,
      format,
    );
    if (
      typeof parsed_file === 'string' &&
      parsed_file === 'Not implemented yet'
    ) {
      return parsed_file;
    }

    // 4. Save the file
    await exportFile(
      parsed_file,
      DataTypeEnum.books,
      file_name,
      file_extension,
    );
    return 'Exported books';
  }
}
