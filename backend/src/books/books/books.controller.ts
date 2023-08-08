import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  SerializeOptions,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BooksService } from './books.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Book } from './entities/book.entity';
import { Keyword } from '../keywords/entities/keyword.entity';
import { Image } from '../images/entities/image.entity';
import { CreateBookDto } from './dtos/create-book.dto';
import { UpdateBookDto } from './dtos/update-book.dto';
import { OwnerEnum } from 'src/users/users.types';
import { RolesEnum } from 'src/users/roles/roles.enum';
import { StatusEnum, StatusType } from '../status/status.types';
import { NullableType } from 'src/utils/types/nullable.type';
import { ExposeGroupsEnum } from 'src/utils/types/expose-groups.enum';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { BookResponseSchema } from 'src/utils/schemas/book.schema';

@ApiTags('Books')
@ApiExtraModels(Book, Keyword, Image)
@ApiUnauthorizedResponse({ description: 'Unauthorized.' })
@ApiForbiddenResponse({ description: 'Forbidden.' })
@ApiNotFoundResponse({ description: 'Store not found.' })
@SerializeOptions({ groups: [ExposeGroupsEnum.me] })
@ApiBearerAuth()
@Roles(RolesEnum.store)
@Controller()
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  // * ######  POST /books (Auth)[Store] ######
  @ApiOperation({
    summary: 'Create a book',
    description: '[Store] Add a book to the store',
  })
  @ApiCreatedResponse({
    description: 'The book has been successfully created.',
    schema: BookResponseSchema,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Request() req,
    @Body() createBookDto: CreateBookDto,
  ): Promise<Book> {
    const result = await this.booksService.create(
      req.user.id,
      OwnerEnum.user,
      createBookDto,
    );
    if (typeof result === 'string' && result === 'NotFound') {
      throw new NotFoundException(result);
    }
    return result as Book;
  }

  // * ######  GET /books/new-ref (Auth)[Store] ######
  @ApiOperation({
    summary: 'Get a new reference.',
    description: '[Store] Get a new reference (the last one + 1).',
  })
  @ApiOkResponse({
    description: 'The new reference has been successfully retrieved.',
    type: Number,
  })
  @HttpCode(HttpStatus.OK)
  @Get('new-ref')
  async getNewRef(@Request() req): Promise<number> {
    const result = await this.booksService.getNewRef(
      req.user.id,
      OwnerEnum.user,
    );
    if (typeof result === 'string' && result === 'NotFound') {
      throw new NotFoundException(result);
    }
    return result as number;
  }

  // * ######  GET /books/count (Auth)[Store] ######
  @ApiOperation({
    summary: 'Count books',
    description: '[Store] Count books from the store',
  })
  @ApiOkResponse({
    description: 'The books have been successfully counted.',
    type: Number,
  })
  @HttpCode(HttpStatus.OK)
  @Get('count')
  async count(@Request() req): Promise<number> {
    const result = await this.booksService.count(req.user.id, OwnerEnum.user);
    if (typeof result === 'string' && result === 'NotFound') {
      throw new NotFoundException(result);
    }
    return result as number;
  }

  // * ######  GET /books  (Auth)[Store] ######
  @ApiOperation({
    summary: 'Get all books',
    description: '[Store] Get all books from the store',
  })
  @ApiOkResponse({
    description: 'The books have been successfully retrieved.',
    schema: {
      allOf: [
        {
          properties: {
            data: {
              type: 'array',
              items: BookResponseSchema,
            },
            hasNextPage: { type: 'boolean' },
          },
        },
      ],
    },
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @ApiQuery({ name: 'ISBN', required: false, type: String })
  @ApiQuery({ name: 'title', required: false, type: String })
  @ApiQuery({ name: 'author', required: false, type: String })
  @ApiQuery({ name: 'publisher', required: false, type: String })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiQuery({ name: 'publication_place', required: false, type: String })
  @ApiQuery({ name: 'collection', required: false, type: String })
  @ApiQuery({ name: 'min-price', required: false, type: Number })
  @ApiQuery({ name: 'max-price', required: false, type: Number })
  @ApiQuery({ name: 'min-pages', required: false, type: Number })
  @ApiQuery({ name: 'max-pages', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: StatusEnum })
  @ApiQuery({ name: 'location', required: false, type: Number })
  @ApiQuery({
    name: 'language',
    required: false,
    description: 'ISO 639-1 code',
  })
  @ApiQuery({ name: 'topics', required: false, isArray: true })
  @ApiQuery({ name: 'keywords', required: false, isArray: true })
  @HttpCode(HttpStatus.OK)
  @Get()
  async findMany(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Request() req,
    @Query('ISBN') ISBN?: NullableType<string>,
    @Query('title') title?: NullableType<string>,
    @Query('author') author?: NullableType<string>,
    @Query('publisher') publisher?: NullableType<string>,
    @Query('year') year?: NullableType<number>,
    @Query('publication_place') publication_place?: NullableType<string>,
    @Query('collection') collection?: NullableType<string>,
    @Query('min-price') min_price?: NullableType<number>,
    @Query('max-price') max_price?: NullableType<number>,
    @Query('min-pages') min_pages?: NullableType<number>,
    @Query('max-pages') max_pages?: NullableType<number>,
    @Query('status') status?: NullableType<StatusType>,
    @Query('location') location?: NullableType<number>,
    @Query('language') language?: NullableType<string>,
    @Query('topics') topics?: NullableType<string[]>,
    @Query('keywords') keywords?: NullableType<string[]>,
  ): Promise<InfinityPaginationResultType<Book>> {
    if (limit > 50) {
      limit = 50;
    }
    const result = await this.booksService.findManyPaginated(
      { page, limit },
      req.user.id,
      OwnerEnum.user,
      ISBN,
      title,
      author,
      publisher,
      year,
      publication_place,
      collection,
      min_price,
      max_price,
      min_pages,
      max_pages,
      status,
      location,
      language,
      topics,
      keywords,
    );
    if (typeof result === 'string' && result === 'NotFound') {
      throw new NotFoundException(result);
    }
    return infinityPagination(result as Book[], { page, limit });
  }

  // * ######  GET /books/:ref (Auth)[Store] ######
  @ApiOperation({
    summary: 'Get a book',
    description: '[Store] Get a book from the store by its ID',
  })
  @ApiOkResponse({
    description: 'The book has been successfully retrieved.',
    schema: BookResponseSchema,
  })
  @ApiParam({
    name: 'ref',
    required: true,
    type: Number,
    description: 'Book reference',
  })
  @HttpCode(HttpStatus.OK)
  @Get(':ref')
  async findOne(@Request() req, @Param('ref') ref?: number): Promise<Book> {
    const result = await this.booksService.findOne(
      null,
      req.user.id,
      OwnerEnum.user,
      ref,
    );
    if (typeof result === 'string' && result === 'NotFound') {
      throw new NotFoundException(result);
    }
    return result as Book;
  }

  // * ######  PATCH /books/ref (Auth)[Store] ######
  @ApiOperation({
    summary: 'Update a book',
    description: '[Store] Update a book from the store by its reference',
  })
  @ApiNoContentResponse({
    description: 'The book has been successfully updated.',
    schema: BookResponseSchema,
  })
  @ApiParam({
    name: 'ref',
    required: true,
    type: Number,
    description: 'Book reference',
  })
  @ApiInternalServerErrorResponse({
    description: 'The book has not been updated.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':ref')
  async updateOne(
    @Request() req,
    @Param('ref') ref?: number,
    @Body() updateBookDto?: UpdateBookDto,
  ): Promise<void> {
    const result = await this.booksService.updateOne(
      req.user.id,
      OwnerEnum.user,
      ref,
      updateBookDto,
    );
    if (typeof result === 'string' && result === 'NotFound') {
      throw new NotFoundException(result);
    }
    if (typeof result === 'string' && result === 'NotUpdated') {
      throw new InternalServerErrorException(result);
    }
  }

  // * ######  DELETE /books/ref (Auth)[Store] ######
  @ApiOperation({
    summary: 'Delete a book',
    description: '[Store] (SOFT) Delete a book from the store by its reference',
  })
  @ApiNoContentResponse({
    description: 'The book has been successfully deleted.',
    schema: BookResponseSchema,
  })
  @ApiParam({
    name: 'ref',
    required: true,
    type: Number,
    description: 'Book reference',
  })
  @ApiInternalServerErrorResponse({
    description: 'The book has not been deleted.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':ref')
  async deleteOne(@Request() req, @Param('ref') ref?: number): Promise<void> {
    const result = await this.booksService.softDeleteOne(
      req.user.id,
      OwnerEnum.user,
      ref,
    );
    if (typeof result === 'string' && result === 'NotFound') {
      throw new NotFoundException(result);
    }
    if (typeof result === 'string' && result === 'NotDeleted') {
      throw new InternalServerErrorException(result);
    }
  }

  // * ######  PATCH /books/ref/restore (Auth)[Store] ######
  @ApiOperation({
    summary: 'Restore a book',
    description: '[Store] Restore a book from the store by its reference',
  })
  @ApiNoContentResponse({
    description: 'The book has been successfully restored.',
    schema: BookResponseSchema,
  })
  @ApiParam({
    name: 'ref',
    required: true,
    type: Number,
    description: 'Book reference',
  })
  @ApiInternalServerErrorResponse({
    description: 'The book has not been restored.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':ref/restore')
  async restoreOne(@Request() req, @Param('ref') ref?: number): Promise<void> {
    const result = await this.booksService.restoreOne(
      req.user.id,
      OwnerEnum.user,
      ref,
    );
    if (typeof result === 'string' && result === 'NotFound') {
      throw new NotFoundException(result);
    }
    if (typeof result === 'string' && result === 'NotRestored') {
      throw new InternalServerErrorException(result);
    }
  }

  // ~ Other
  // * ######  PATCH /books/ref/sell (Auth)[Store] ######
  @ApiOperation({
    summary: 'Sell a book',
    description: '[Store] Sell a book from the store by its reference',
  })
  @ApiNoContentResponse({
    description: 'The book has been successfully sold.',
    schema: BookResponseSchema,
  })
  @ApiParam({
    name: 'ref',
    required: true,
    type: Number,
    description: 'Book reference',
  })
  @ApiInternalServerErrorResponse({
    description: 'The book has not been sold.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':ref/sell')
  async sellOne(@Request() req, @Param('ref') ref?: number): Promise<void> {
    const result = await this.booksService.sellOne(
      req.user.id,
      OwnerEnum.user,
      ref,
    );
    if (typeof result === 'string' && result === 'NotFound') {
      throw new NotFoundException(result);
    }
    if (typeof result === 'string' && result !== 'Sold') {
      throw new InternalServerErrorException(result);
    }
  }

  // * ######  PATCH /books/ref/add-stock (Auth)[Store] ######
  @ApiOperation({
    summary: 'Add stock to a book',
    description: '[Store] Add stock to a book from the store by its reference',
  })
  @ApiNoContentResponse({
    description: 'The stock has been successfully added.',
    schema: BookResponseSchema,
  })
  @ApiParam({
    name: 'ref',
    required: true,
    type: Number,
    description: 'Book reference',
  })
  @ApiQuery({
    name: 'stock',
    required: false,
    type: Number,
    description: 'Stock to add',
  })
  @ApiInternalServerErrorResponse({
    description: 'The stock has not been added.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':ref/add-stock')
  async addStockOne(
    @Request() req,
    @Param('ref') ref?: number,
    @Query('stock') stock?: NullableType<number>,
  ): Promise<void> {
    const result = await this.booksService.addStock(
      req.user.id,
      OwnerEnum.user,
      ref,
      stock,
    );
    if (typeof result === 'string' && result === 'NotFound') {
      throw new NotFoundException(result);
    }
    if (typeof result === 'string' && result !== 'StockAdded') {
      throw new InternalServerErrorException(result);
    }
  }
}
