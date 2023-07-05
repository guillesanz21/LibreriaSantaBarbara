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
import { User } from '../entities/user.entity';
import { UsersService } from '../users.service';
import { CreateUserAdminDto } from './dtos/create-user.admin.dto';
import { UpdateUserAdminDto } from './dtos/update-user.admin.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesEnum } from '../roles/roles.enum';
import { NullableType } from 'src/utils/types/nullable.type';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { infinityPagination } from 'src/utils/infinity-pagination';

@Controller()
@Roles(RolesEnum.admin)
export class AdminController {
  constructor(private readonly usersService: UsersService) {}

  @SerializeOptions({
    groups: ['admin'],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreateUserAdminDto): Promise<User> {
    return this.usersService.create(body);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  findMany(
    @Query('user-type') user_type_id?: number,
    @Query('role') role_id?: number,
    @Query('email') email?: string,
    @Query('NIF') NIF?: string,
    @Query('address') address?: string,
    @Query('phone') phone_number?: string,
  ): Promise<User[]> {
    return this.usersService.findMany({
      user_type_id: +user_type_id ? +user_type_id : undefined,
      role_id: role_id ? +role_id : undefined,
      email,
      NIF,
      address,
      phone_number,
    });
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get('/pagination')
  @HttpCode(HttpStatus.OK)
  async findManyWithPagination(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('user-type') user_type_id?: number,
    @Query('role') role_id?: number,
    @Query('email') email?: string,
    @Query('NIF') NIF?: string,
    @Query('address') address?: string,
    @Query('phone') phone_number?: string,
  ): Promise<InfinityPaginationResultType<User>> {
    if (limit > 50) {
      limit = 50;
    }
    return infinityPagination(
      await this.usersService.findManyWithPagination(
        {
          user_type_id: +user_type_id ? +user_type_id : undefined,
          role_id: role_id ? +role_id : undefined,
          email,
          NIF,
          address,
          phone_number,
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
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number): Promise<NullableType<User>> {
    const store = await this.usersService.findOne({ id: +id });
    if (!store) {
      throw new NotFoundException('store not found');
    }
    return store;
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: number,
    @Body() body: UpdateUserAdminDto,
  ): Promise<void> {
    const result = await this.usersService.update(id, body);
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
      result = await this.usersService.hardDelete(id);
    } else {
      result = await this.usersService.softDelete(id);
    }
    if (!result) {
      throw new NotFoundException('store not found');
    }
  }

  @Patch(':id/restore')
  @HttpCode(HttpStatus.NO_CONTENT)
  async restore(@Param('id') id: number): Promise<void> {
    const result = await this.usersService.restore(id);
    if (!result) {
      throw new NotFoundException('store not found');
    }
  }
}
