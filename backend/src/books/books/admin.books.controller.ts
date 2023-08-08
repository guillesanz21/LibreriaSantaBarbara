import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  SerializeOptions,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Book } from './entities/book.entity';
import { BooksService } from './books.service';
import { CreateBookDto } from './dtos/create-book.dto';
import { UpdateBookDto } from './dtos/update-book.dto';
import { RolesEnum } from 'src/users/roles/roles.enum';
import { NullableType } from 'src/utils/types/nullable.type';
import { ExposeGroupsEnum } from 'src/utils/types/expose-groups.enum';
import { BookResponseSchema } from 'src/utils/schemas/book.schema';
import { OwnerEnum } from 'src/users/users.types';

@ApiTags('Books/Admin')
@ApiUnauthorizedResponse({ description: 'Unauthorized.' })
@ApiForbiddenResponse({ description: 'Forbidden.' })
@ApiNotFoundResponse({ description: 'Store not found.' })
@SerializeOptions({ groups: [ExposeGroupsEnum.admin] })
@ApiBearerAuth()
@Roles(RolesEnum.admin)
@Controller('admin')
export class BooksAdminController {
  constructor(private readonly booksService: BooksService) {}

  // * ######  POST /books/admin (Auth)[Admin] ######
  @ApiOperation({
    summary: 'Create a book',
    description: '[Admin] Add a book to the store',
  })
  @ApiCreatedResponse({
    description: 'The book has been successfully created.',
    schema: BookResponseSchema,
  })
  @ApiQuery({
    name: 'store_id',
    required: false,
    type: Number,
    description: 'ID of the store. Default 1',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Query('store_id', new DefaultValuePipe(1), ParseIntPipe) store_id: number,
    @Body() createBookDto: CreateBookDto,
  ): Promise<Book> {
    const result = await this.booksService.create(
      store_id,
      OwnerEnum.store,
      createBookDto,
    );
    if (typeof result === 'string' && result === 'NotFound') {
      throw new NotFoundException(result);
    }
    return result as Book;
  }

  // * ######  PATCH /books/admin/ref (Auth)[Admin] ######
  @ApiOperation({
    summary: 'Update a book',
    description: '[Admin] Update a book from the store by its reference',
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
  @ApiQuery({
    name: 'store_id',
    required: false,
    type: Number,
    description: 'ID of the store. Default 1',
  })
  @ApiInternalServerErrorResponse({
    description: 'The book has not been updated.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':ref')
  async updateOne(
    @Query('store_id', new DefaultValuePipe(1), ParseIntPipe) store_id: number,
    @Param('ref') ref?: number,
    @Body() updateBookDto?: UpdateBookDto,
  ): Promise<void> {
    const result = await this.booksService.updateOne(
      store_id,
      OwnerEnum.store,
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

  // * ######  DELETE /books/admin/ref (Auth)[Admin] ######
  @ApiOperation({
    summary: 'Delete a book',
    description: '[Admin] (SOFT) Delete a book from the store by its reference',
  })
  @ApiNoContentResponse({
    description: 'The book has been successfully deleted.',
    schema: BookResponseSchema,
  })
  @ApiQuery({
    name: 'store_id',
    required: false,
    type: Number,
    description: 'ID of the store. Default 1',
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
  async deleteOne(
    @Query('store_id', new DefaultValuePipe(1), ParseIntPipe) store_id: number,
    @Param('ref') ref?: number,
  ): Promise<void> {
    const result = await this.booksService.softDeleteOne(
      store_id,
      OwnerEnum.store,
      ref,
    );
    if (typeof result === 'string' && result === 'NotFound') {
      throw new NotFoundException(result);
    }
    if (typeof result === 'string' && result === 'NotDeleted') {
      throw new InternalServerErrorException(result);
    }
  }

  // * ######  DELETE /books/admin/ref/hard (Auth)[Admin] ######
  @ApiOperation({
    summary: 'Hard delete a book',
    description: '[Admin] (HARD) Delete a book from the store by its reference',
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
  @ApiQuery({
    name: 'store_id',
    required: false,
    type: Number,
    description: 'ID of the store. Default 1',
  })
  @ApiInternalServerErrorResponse({
    description: 'The book has not been deleted.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':ref/hard')
  async hardDeleteOne(
    @Query('store_id', new DefaultValuePipe(1), ParseIntPipe) store_id: number,
    @Param('ref') ref?: number,
  ): Promise<void> {
    const result = await this.booksService.hardDeleteOne(
      store_id,
      OwnerEnum.store,
      ref,
    );
    if (typeof result === 'string' && result === 'NotFound') {
      throw new NotFoundException(result);
    }
    if (typeof result === 'string' && result === 'NotDeleted') {
      throw new InternalServerErrorException(result);
    }
  }

  // * ######  PATCH /books/admin/ref/restore (Auth)[Admin] ######
  @ApiOperation({
    summary: 'Restore a book',
    description: '[Admin] Restore a book from the store by its reference',
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
  @ApiQuery({
    name: 'store_id',
    required: false,
    type: Number,
    description: 'ID of the store. Default 1',
  })
  @ApiInternalServerErrorResponse({
    description: 'The book has not been restored.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':ref/restore')
  async restoreOne(
    @Query('store_id', new DefaultValuePipe(1), ParseIntPipe) store_id: number,
    @Param('ref') ref?: number,
  ): Promise<void> {
    const result = await this.booksService.restoreOne(
      store_id,
      OwnerEnum.store,
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
  // * ######  PATCH /books/admin/ref/sell (Auth)[Admin] ######
  @ApiOperation({
    summary: 'Sell a book',
    description: '[Admin] Sell a book from the store by its reference',
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
  @ApiQuery({
    name: 'store_id',
    required: false,
    type: Number,
    description: 'ID of the store. Default 1',
  })
  @ApiInternalServerErrorResponse({
    description: 'The book has not been sold.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':ref/sell')
  async sellOne(
    @Query('store_id', new DefaultValuePipe(1), ParseIntPipe) store_id: number,
    @Param('ref') ref?: number,
  ): Promise<void> {
    const result = await this.booksService.sellOne(
      store_id,
      OwnerEnum.store,
      ref,
    );
    if (typeof result === 'string' && result === 'NotFound') {
      throw new NotFoundException(result);
    }
    if (typeof result === 'string' && result !== 'Sold') {
      throw new InternalServerErrorException(result);
    }
  }

  // * ######  PATCH /books/admin/ref/add-stock (Auth)[Admin] ######
  @ApiOperation({
    summary: 'Add stock to a book',
    description: '[Admin] Add stock to a book from the store by its reference',
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
    name: 'store_id',
    required: false,
    type: Number,
    description: 'ID of the store. Default 1',
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
    @Query('store_id', new DefaultValuePipe(1), ParseIntPipe) store_id: number,
    @Param('ref') ref?: number,
    @Query('stock') stock?: NullableType<number>,
  ): Promise<void> {
    const result = await this.booksService.addStock(
      store_id,
      OwnerEnum.store,
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
