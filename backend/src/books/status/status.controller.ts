import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { StatusService } from './status.service';
import { Status } from './entities/status.entity';
import { CreateStatusDto } from './dtos/create-status.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesEnum } from 'src/users/roles/roles.enum';
import { Public } from 'src/auth/decorators/public.decorator';
import { NullableType } from 'src/utils/types/nullable.type';
import { UpdateStatusDto } from './dtos/update-status.dto';

@ApiTags('Books/Status')
@Controller()
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  // * ######  POST /books/status (Auth)[Admin] ######
  @ApiOperation({
    summary: 'Create a status',
    description: '[Admin] Create a status associated to the store.',
  })
  @ApiCreatedResponse({
    description: 'The status.',
    type: Status,
  })
  @ApiForbiddenResponse({
    description: 'Forbidden.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @ApiBearerAuth()
  @Roles(RolesEnum.admin)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createStatusDto: CreateStatusDto): Promise<Status> {
    return this.statusService.create(createStatusDto);
  }

  // * ######  GET /books/status ######
  @ApiOperation({
    summary: 'Get all the status',
    description: 'Get all the status available.',
  })
  @ApiOkResponse({
    description: 'The status.',
    type: [Status],
  })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Get()
  findMany(): Promise<NullableType<Status[]>> {
    return this.statusService.findMany({});
  }

  // * ######  GET /books/status/:id ######
  @ApiOperation({
    summary: 'Get a status by id',
    description: 'Get a status by id.',
  })
  @ApiOkResponse({
    description: 'The status.',
    type: Status,
  })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<NullableType<Status>> {
    return this.statusService.findOne({ id: +id });
  }

  // * ######  PATCH /books/status/:id (Auth)[Admin] ######
  @ApiOperation({
    summary: 'Update a status by id',
    description: '[Admin] Update a status by id.',
  })
  @ApiNoContentResponse({
    description: 'The status has been successfully updated.',
  })
  @ApiInternalServerErrorResponse({
    description: 'The status could not be updated.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @ApiBearerAuth()
  @Roles(RolesEnum.admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ): Promise<void> {
    const result = await this.statusService.update(+id, updateStatusDto);
    if (!result) {
      throw new InternalServerErrorException(
        'The status could not be updated.',
      );
    }
  }

  // * ######  DELETE /books/status/:id (Auth)[Admin] ######
  @ApiOperation({
    summary: 'Delete a status by id',
    description: '[Admin] Delete a status by id.',
  })
  @ApiNoContentResponse({
    description: 'The status has been successfully deleted.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @ApiInternalServerErrorResponse({
    description: 'The status could not be deleted.',
  })
  @ApiBearerAuth()
  @Roles(RolesEnum.admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id')
  async delete(@Param('id') id: string): Promise<void> {
    const result = await this.statusService.hardDelete(+id);
    if (!result) {
      throw new InternalServerErrorException(
        'The status could not be deleted.',
      );
    }
  }
}
