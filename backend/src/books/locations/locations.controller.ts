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
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Location as LocationEntity } from './entities/location.entity';
import { LocationsService } from './locations.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateLocationDto } from './dtos/create-location.dto';
import { UpdateLocationDto } from './dtos/update-location.dto';
import { RolesEnum } from 'src/users/roles/roles.enum';
import { NullableType } from 'src/utils/types/nullable.type';

@ApiTags('Books/Locations')
@ApiBearerAuth()
@Roles(RolesEnum.store, RolesEnum.admin)
@Controller()
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  // * ######  POST /books/locations ######
  @ApiOperation({
    summary: 'Create a location',
    description: 'Create a location associated to the store.',
  })
  @ApiCreatedResponse({
    description: 'The location.',
    type: LocationEntity,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(
    @Request() req,
    @Body() createLocationDto: CreateLocationDto,
  ): Promise<NullableType<LocationEntity>> {
    return this.locationsService.create(req.user.storeId, createLocationDto);
  }

  // * ######  GET /books/locations ######
  @ApiOperation({
    summary: 'Get all the locations',
    description: 'Get all the locations associated to the store.',
  })
  @ApiOkResponse({
    description: 'The locations.',
    type: [LocationEntity],
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  findMany(@Request() req): Promise<NullableType<LocationEntity[]>> {
    return this.locationsService.findMany(req.user.storeId);
  }

  // * ######  GET /books/locations/:id ######
  @ApiOperation({
    summary: 'Get a location by id',
    description: 'Get a location by id.',
  })
  @ApiOkResponse({
    description: 'The location.',
    type: LocationEntity,
  })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOne(
    @Request() req,
    @Param('id') id: string,
  ): Promise<NullableType<LocationEntity>> {
    return this.locationsService.findOne(req.user.storeId, +id);
  }

  // * ######  PATCH /books/locations/:id ######
  @ApiOperation({
    summary: 'Update a location',
    description: 'Update a location associated to the store.',
  })
  @ApiNoContentResponse({
    description: 'The location has been updated.',
  })
  @ApiNotFoundResponse({
    description: 'Location not found.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ): Promise<void> {
    const result = await this.locationsService.update(
      req.user.storeId,
      +id,
      updateLocationDto,
    );
    if (!result) {
      throw new NotFoundException(`Location not found`);
    }
  }

  // * ######  DELETE /books/locations/:id ######
  @ApiOperation({
    summary: 'Delete a location',
    description: '(Hard) Delete a location associated to the store.',
  })
  @ApiNoContentResponse({
    description: 'The location has been (hard) deleted.',
  })
  @ApiNotFoundResponse({
    description: 'Location not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Location not deleted.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(@Request() req, @Param('id') id: string): Promise<void> {
    const result = await this.locationsService.hardDelete(
      req.user.storeId,
      +id,
    );
    if (result === 'NotFound') {
      throw new NotFoundException(`Location not found`);
    }
    if (result === 'NotDeleted') {
      throw new InternalServerErrorException(`Location not deleted`);
    }
  }
}
