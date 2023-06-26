import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  DefaultValuePipe,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { Store } from './entities/store.entity';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dtos/create-store.dto';
import { UpdateStoreDto } from './dtos/update-store.dto';
import { NullableType } from 'src/utils/types/nullable.type';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { infinityPagination } from 'src/utils/infinity-pagination';

// TODO: Admin only
@Controller()
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  create(@Body() body: CreateStoreDto): Promise<Store> {
    return this.storesService.create(body);
  }

  @Get()
  findMany(
    @Query('email') email?: string,
    @Query('NIF') NIF?: string,
    @Query('name') name?: string,
    @Query('address') address?: string,
    @Query('phone') phone_number?: string,
    @Query('is-admin') is_admin?: boolean,
  ): Promise<Store[]> {
    return this.storesService.findMany({
      email,
      NIF,
      name,
      address,
      phone_number,
      is_admin,
    });
  }

  @Get('/pagination')
  async findManyWithPagination(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('email') email?: string,
    @Query('NIF') NIF?: string,
    @Query('name') name?: string,
    @Query('address') address?: string,
    @Query('phone') phone_number?: string,
    @Query('is-admin') is_admin?: boolean,
  ): Promise<InfinityPaginationResultType<Store>> {
    if (limit > 50) {
      limit = 50;
    }
    return infinityPagination(
      await this.storesService.findManyWithPagination(
        {
          email,
          NIF,
          name,
          address,
          phone_number,
          is_admin,
        },
        {
          page,
          limit,
        },
      ),
      { page, limit },
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<NullableType<Store>> {
    const store = await this.storesService.findOne({ id: +id });
    if (!store) {
      throw new NotFoundException('store not found');
    }
    return store;
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() body: UpdateStoreDto,
  ): Promise<Store> {
    return this.storesService.update(id, body);
  }

  @Delete(':id')
  remove(
    @Param('id') id: number,
    @Query('mode') deleteMode?: string,
  ): Promise<boolean> {
    if (deleteMode && deleteMode === 'hard') {
      return this.storesService.hardDelete(id);
    } else {
      return this.storesService.softDelete(id);
    }
  }

  @Patch(':id/restore')
  restore(@Param('id') id: number): Promise<boolean> {
    return this.storesService.restore(id);
  }
}
