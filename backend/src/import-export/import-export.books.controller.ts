import {
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  ParseBoolPipe,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { ImportExportService } from './import-export.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FileFormatEnum } from './utils/parser/FileFormat';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesEnum } from 'src/users/roles/roles.enum';

@ApiTags('Import/Export')
@ApiBearerAuth()
@Roles(RolesEnum.store)
@Controller()
export class ImportExportBooksController {
  constructor(private readonly importExportService: ImportExportService) {}

  // * ######  POST /books/import/all ######
  @ApiOperation({
    summary: 'Import all books from a file.',
    description:
      'Import all books from a file, deleting all the previous books in the database',
  })
  @ApiQuery({
    name: 'format',
    required: true,
    enum: FileFormatEnum,
  })
  @ApiQuery({
    name: 'keywords-to-topics',
    required: false,
    description:
      "If true, topics will be created from keywords (Uniliber doesn't export topics). DEAFULT: false",
  })
  @ApiQuery({
    name: 'clean-description',
    required: false,
    description:
      'If true, the description will be cleaned from &lt;p&gt; and &lt;/p&gt; tags. DEAFULT: false',
  })
  @ApiCreatedResponse({
    description: 'Books imported',
    type: String,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('books/import/all')
  async importBooks(
    @Request() req,
    @Query('format') format: FileFormatEnum,
    @Query('keywords-to-topics', new DefaultValuePipe(false), ParseBoolPipe)
    keywords_to_topics?: boolean,
    @Query('clean-description', new DefaultValuePipe(false), ParseBoolPipe)
    clean_description?: boolean,
  ): Promise<string> {
    const imported_books = await this.importExportService.importBooks(
      req.user.id,
      format,
      keywords_to_topics,
      clean_description,
    );
    if (imported_books === 'Not implemented') {
      throw new InternalServerErrorException('Method not implemented yet');
    }
    if (imported_books === 'NotFound') {
      throw new NotFoundException('NotFound');
    }
    if (imported_books === 'Error importing') {
      throw new InternalServerErrorException('Books not imported');
    }
    return imported_books;
  }

  // * ######  POST  ######
  @Post('books/export')
  async exportBooks() {
    return this.importExportService.exportBooks();
  }

  // * ######  POST  ######
  @Post('books/import/conflicts')
  async importBooksWithConflicts() {
    return this.importExportService.importBooksWithConflicts();
  }
}
