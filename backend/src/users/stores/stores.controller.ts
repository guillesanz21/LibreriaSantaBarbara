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
import { DestructureUser } from '../interceptors/destructure-user.interceptor';
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

  @DestructureUser()
  @Get()
  findMany(
    @Query('email') email?: string,
    @Query('NIF') NIF?: string,
    @Query('address') address?: string,
    @Query('phone') phone_number?: string,
    @Query('name') name?: string,
    @Query('role') role?: string,
    @Query('approved') approved?: boolean,
  ): Promise<Store[]> {
    return this.storesService.findMany({
      email,
      NIF,
      address,
      phone_number,
      name,
      role,
      approved,
    });
  }

  @DestructureUser()
  @Get('/pagination')
  async findManyWithPagination(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('email') email?: string,
    @Query('NIF') NIF?: string,
    @Query('address') address?: string,
    @Query('phone') phone_number?: string,
    @Query('name') name?: string,
    @Query('role') role?: string,
    @Query('approved') approved?: boolean,
  ): Promise<InfinityPaginationResultType<Store>> {
    if (limit > 50) {
      limit = 50;
    }
    return infinityPagination(
      await this.storesService.findManyWithPagination(
        {
          email,
          NIF,
          address,
          phone_number,
          name,
          role,
          approved,
        },
        {
          page,
          limit,
        },
      ),
      { page, limit },
    );
  }

  @DestructureUser()
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
