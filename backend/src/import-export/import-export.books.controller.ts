import { Controller, Get, Query } from '@nestjs/common';
import { ImportExportService } from './import-export.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { FileFormatEnum } from './utils/parser/FileFormat';

@ApiTags('Import/Export')
@Public()
@Controller()
export class ImportExportBooksController {
  constructor(private readonly importExportService: ImportExportService) {}

  // * ######  GET  ######
  @ApiQuery({
    name: 'format_from',
    required: true,
    enum: FileFormatEnum,
  })
  @ApiQuery({
    name: 'format_to',
    required: true,
    enum: FileFormatEnum,
  })
  @Get('books/import')
  async importBooks(
    @Query('format_from') format_from: FileFormatEnum,
    @Query('format_to') format_to: FileFormatEnum,
  ) {
    return this.importExportService.importBooks(format_from, format_to);
  }
  // * ######  GET  ######
  @Get('books/export')
  async exportBooks() {
    return this.importExportService.exportBooks();
  }

  // * ######  GET  ######
  @Get('books/import/conflicts')
  async importBooksWithConflicts() {
    return this.importExportService.importBooksWithConflicts();
  }
}
