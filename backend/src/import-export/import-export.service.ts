import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/books/books/entities/book.entity';
import { BooksService } from 'src/books/books/books.service';
import { parser } from './utils/parser';
import { booksTransformer } from './utils/transformer';
import { FileFormatEnum } from './utils/parser/FileFormat';
import { importFile, exportFile } from './utils/fileSystem';
import { ExtensionFormatEnum } from './utils/fileSystem/ExtensionFormat';
import { UniliberType } from './utils/transformer/fields.types';
import { ImportExportEnum } from './utils/transformer/ImportExportFormat';

@Injectable()
export class ImportExportService {
  constructor(
    @InjectRepository(Book)
    private readonly booksRepository: typeof Book,
    private readonly booksService: BooksService,
  ) {}

  // Full Import (Delete all books in database and import)
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
    const parsed_file = parser(data, format, format_to);
    const books: UniliberType[] = parsed_file.data;

    // 3. Transform the file (Adapt the data to the database schema)
    const transformed_books = booksTransformer(
      books,
      ImportExportEnum.uniliber,
      ImportExportEnum.db,
      keywords_to_topics,
      clean_description,
    );

    // 4. Transaction: Delete previous books and save the books in database, or fail.
    const created_books = await this.booksService.bulkCreate(
      user_id,
      'user',
      transformed_books,
      true,
    );

    return created_books ? 'Imported books' : 'Error importing';
  }

  async importBooksWithConflicts() {
    // 1. Read the file
    // 2. Parse the file
    // 3. Adapt the data to the database schema
    // 4. If there are books in database, compare them with the ones in the file
    // 5. Save only the books that are not in database and update the ones that have changed
    return 'Imported books with conflicts';
  }

  async exportBooks() {
    /*
    TODO: Añadir un nuevo campo a partir de: status, sold_at.
    "vendido": true/false
    TODO: Un único campo con las imágenes separadas por || ooo 4 campos: Imagen1, Imagen2,...
    "imagenes": "https://example.com/image1.jpg||https://example.com/image1.jpg||https://example.com/image1.jpg||https://example.com/image1.jpg",
    "palabras clave": "Palabra clave 1,Palabra clave 2,Palabra clave 3" // Se separan por comas y la primera letra de cada palabra se pone en mayúscula
    "materias": "Materia 1, Materia 2, Materia 3" // Se separan por comas y la primera letra de cada palabra se pone en mayúscula,
    "idiomas": "Idioma 1, Idioma 2" // español, inglés, francés
    */
    // 1. Read the books from database
    const data = await this.booksService.findAll();
    // 2. Transform the books to the file schema

    // 3. Parse the file
    const parsed_file = parser(data, FileFormatEnum.json, FileFormatEnum.tsv);
    // 4. Save the file
    await exportFile(parsed_file, 'books', ExtensionFormatEnum.txt);
    return 'Exported books';
  }
}
