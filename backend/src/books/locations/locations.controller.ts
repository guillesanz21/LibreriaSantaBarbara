import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Request,
  SerializeOptions,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Location as LocationEntity } from './entities/location.entity';
import { LocationsService } from './locations.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateLocationDto } from './dtos/create-location.dto';
import { UpdateLocationDto } from './dtos/update-location.dto';
import { RolesEnum } from 'src/users/roles/roles.enum';
import { ExposeGroupsEnum } from 'src/utils/types/expose-groups.enum';
import { NullableType } from 'src/utils/types/nullable.type';

@ApiTags('Books/Locations')
@ApiForbiddenResponse({ description: 'Forbidden.' })
@ApiUnauthorizedResponse({ description: 'Unauthorized.' })
@ApiNotFoundResponse({ description: 'Store not found.' })
@SerializeOptions({
  groups: [ExposeGroupsEnum.me, ExposeGroupsEnum.admin],
})
@ApiBearerAuth()
@Roles(RolesEnum.store, RolesEnum.admin)
@Controller()
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  // * ######  POST /books/locations (Auth)[Admin, Store] ######
  @ApiOperation({
    summary: 'Create a location',
    description: '[Admin, Store] Create a location associated to the store.',
  })
  @ApiCreatedResponse({
    description: 'The location.',
    type: LocationEntity,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Request() req,
    @Body() createLocationDto: CreateLocationDto,
  ): Promise<NullableType<LocationEntity>> {
    const result = await this.locationsService.create(
      req.user.id,
      createLocationDto,
    );
    if (typeof result === 'string' && result === 'NotFound') {
      throw new NotFoundException(result);
    }
    return result as LocationEntity;
  }

  // * ######  GET /books/locations (Auth)[Admin, Store] ######
  @ApiOperation({
    summary: 'Get all the locations',
    description:
      '[Admin, Store] Get all the locations associated to the store.',
  })
  @ApiOkResponse({
    description: 'The locations.',
    type: [LocationEntity],
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  async findMany(@Request() req): Promise<NullableType<LocationEntity[]>> {
    const result = await this.locationsService.findMany(req.user.id);
    if (typeof result === 'string' && result === 'NotFound') {
      throw new NotFoundException(result);
    }
    return result as LocationEntity[];
  }

  // * ######  GET /books/locations/:id (Auth)[Admin, Store] ######
  @ApiOperation({
    summary: 'Get a location by id',
    description: '[Admin, Store] Get a location by id.',
  })
  @ApiOkResponse({
    description: 'The location.',
    type: LocationEntity,
  })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(
    @Request() req,
    @Param('id') id: string,
  ): Promise<NullableType<LocationEntity>> {
    const result = await this.locationsService.findOne(req.user.id, +id);
    if (typeof result === 'string' && result === 'NotFound') {
      throw new NotFoundException(result);
    }
    return result as LocationEntity;
  }

  // * ######  PATCH /books/locations/:id (Auth)[Admin, Store] ######
  @ApiOperation({
    summary: 'Update a location',
    description: '[Admin, Store] Update a location associated to the store.',
  })
  @ApiNoContentResponse({ description: 'The location has been updated.' })
  @ApiInternalServerErrorResponse({ description: 'Location not updated.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ): Promise<void> {
    const result = await this.locationsService.update(
      req.user.id,
      +id,
      updateLocationDto,
    );
    if (result === 'NotFound') {
      throw new NotFoundException(`Store not found`);
    }
    if (result === 'NotUpdated') {
      throw new InternalServerErrorException(`Location not updated`);
    }
  }

  // * ######  DELETE /books/locations/:id (Auth)[Admin, Store] ######
  @ApiOperation({
    summary: 'Delete a location',
    description:
      '[Admin, Store] (Hard) Delete a location associated to the store.',
  })
  @ApiNoContentResponse({
    description: 'The location has been (hard) deleted.',
  })
  @ApiInternalServerErrorResponse({ description: 'Location not deleted.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(@Request() req, @Param('id') id: string): Promise<void> {
    const result = await this.locationsService.hardDelete(req.user.id, +id);
    if (result === 'NotFound') {
      throw new NotFoundException(result);
    }
    if (result === 'NotDeleted') {
      throw new InternalServerErrorException(`Location not deleted`);
    }
  }
}
