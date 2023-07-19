import { Injectable } from '@nestjs/common';
import { parser } from './utils/parser';
import { FileFormatEnum } from './utils/parser/FileFormat';
import { importFile, exportFile } from './utils/fileSystem';
import { ExtensionFormatEnum } from './utils/fileSystem/ExtensionFormat';

@Injectable()
export class ImportExportService {
  async importBooks(format_from: FileFormatEnum, format_to: FileFormatEnum) {
    // 1. Read the file
    const data = await importFile('original.min.txt');

    // 2. Parse the file
    const parsed_file = parser(data, format_from, format_to);

    // 2.1. Check if there are errors
    // 3. Transform the file (Adapt the data to the database schema)
    // 4. If there are books in database, delete them. count() > 0 => delete()
    // 5. Save the books in database
    return parsed_file;
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
    // 1. Read the books from database
    // DELETE:
    const data = await importFile('original.min.json');
    // 2. Transform the books to the file schema
    // 3. Parse the file
    const parsed_file = parser(data, FileFormatEnum.json, FileFormatEnum.tsv);
    // 4. Save the file
    await exportFile(parsed_file, 'books', ExtensionFormatEnum.txt);
    return 'Exported books';
  }
}
