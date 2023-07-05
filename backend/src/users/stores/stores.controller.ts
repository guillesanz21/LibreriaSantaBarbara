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
  SerializeOptions,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Store } from './entities/store.entity';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dtos/create-store.dto';
import { UpdateStoreDto } from './dtos/update-store.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { DestructureUser } from '../interceptors/destructure-user.interceptor';
import { NullableType } from 'src/utils/types/nullable.type';
import { RolesEnum } from '../roles/roles.enum';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { infinityPagination } from 'src/utils/infinity-pagination';

@Roles(RolesEnum.admin)
@Controller()
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @SerializeOptions({
    groups: ['admin'],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreateStoreDto): Promise<Store> {
    return this.storesService.create(body);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @DestructureUser()
  @Get()
  @HttpCode(HttpStatus.OK)
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

  @SerializeOptions({
    groups: ['admin'],
  })
  @DestructureUser()
  @Get('/pagination')
  @HttpCode(HttpStatus.OK)
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

  @SerializeOptions({
    groups: ['admin'],
  })
  @DestructureUser()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number): Promise<NullableType<Store>> {
    const store = await this.storesService.findOne({ id: +id });
    if (!store) {
      throw new NotFoundException('store not found');
    }
    return store;
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: number,
    @Body() body: UpdateStoreDto,
  ): Promise<void> {
    const result = await this.storesService.update(id, body);
    if (!result) {
      throw new NotFoundException('store not found');
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: number,
    @Query('mode') deleteMode?: string,
  ): Promise<void> {
    let result: boolean;
    if (deleteMode && deleteMode === 'hard') {
      result = await this.storesService.hardDelete(id);
    } else {
      result = await this.storesService.softDelete(id);
    }
    if (!result) {
      throw new NotFoundException('store not found');
    }
  }

  @Patch(':id/restore')
  @HttpCode(HttpStatus.NO_CONTENT)
  async restore(@Param('id') id: number): Promise<void> {
    const result = await this.storesService.restore(id);
    if (!result) {
      throw new NotFoundException('store not found');
    }
  }
}
