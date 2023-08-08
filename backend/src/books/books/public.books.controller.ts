import {
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { Book } from './entities/book.entity';
import { BooksService } from './books.service';
import { StatusEnum, StatusType } from '../status/status.types';
import { NullableType } from 'src/utils/types/nullable.type';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { BookResponseSchema } from 'src/utils/schemas/book.schema';
import { OwnerEnum } from 'src/users/users.types';

@ApiTags('Books/Public')
@ApiNotFoundResponse({ description: 'Store not found.' })
@Public()
@Controller('public')
export class BooksPublicController {
  constructor(private readonly booksService: BooksService) {}

  // * ######  GET /books/public/new-ref ######
  @ApiOperation({
    summary: 'Get a new reference.',
    description: 'Get a new reference (the last one + 1).',
  })
  @ApiOkResponse({
    description: 'The new reference has been successfully retrieved.',
    type: Number,
  })
  @ApiQuery({
    name: 'store_id',
    required: false,
    type: Number,
    description: 'ID of the store. Default 1',
  })
  @HttpCode(HttpStatus.OK)
  @Get('new-ref')
  async getNewRef(
    @Query('store_id', new DefaultValuePipe(1), ParseIntPipe) store_id: number,
  ): Promise<number> {
    const result = await this.booksService.getNewRef(store_id, OwnerEnum.store);
    if (typeof result === 'string' && result === 'NotFound') {
      throw new NotFoundException(result);
    }
    return result as number;
  }

  // * ######  GET /books/public/count ######
  @ApiOperation({
    summary: 'Count books',
    description: '[Store] Count books from the store',
  })
  @ApiOkResponse({
    description: 'The books have been successfully counted.',
    type: Number,
  })
  @ApiQuery({
    name: 'store_id',
    required: false,
    type: Number,
    description: 'ID of the store. Default 1',
  })
  @HttpCode(HttpStatus.OK)
  @Get('count')
  async count(
    @Query('store_id', new DefaultValuePipe(1), ParseIntPipe) store_id: number,
  ): Promise<number> {
    const result = await this.booksService.count(store_id, OwnerEnum.store);
    if (typeof result === 'string' && result === 'NotFound') {
      throw new NotFoundException(result);
    }
    return result as number;
  }

  // * ######  GET /books/public ######
  @ApiOperation({
    summary: 'Get all books',
    description: 'Get all books from the store',
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
  @ApiQuery({
    name: 'store_id',
    required: false,
    type: Number,
    description: 'ID of the store. Default 1',
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
    @Query('store_id', new DefaultValuePipe(1), ParseIntPipe) store_id: number,
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
      store_id,
      OwnerEnum.store,
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

  // * ######  GET /books/public/:ref ######
  @ApiOperation({
    summary: 'Get a book',
    description: 'Get a book from the store by its ID',
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
  @ApiQuery({
    name: 'store_id',
    required: false,
    type: Number,
    description: 'ID of the store. Default 1',
  })
  @HttpCode(HttpStatus.OK)
  @Get(':ref')
  async findOne(
    @Query('store_id', new DefaultValuePipe(1), ParseIntPipe) store_id: number,
    @Param('ref') ref?: number,
  ): Promise<Book> {
    const result = await this.booksService.findOne(
      null,
      store_id,
      OwnerEnum.store,
      ref,
    );
    if (typeof result === 'string' && result === 'NotFound') {
      throw new NotFoundException(result);
    }
    return result as Book;
  }
}
