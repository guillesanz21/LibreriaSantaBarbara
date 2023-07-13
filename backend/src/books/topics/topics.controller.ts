import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TopicsService } from './topics.service';
import { Topic } from './entities/topic.entity';
import { Book } from '../entities/book.entity';
import { CreateTopicDto } from './dtos/create-topic.dto';
import { UpdateTopicDto } from './dtos/update-topic.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesEnum } from 'src/users/roles/roles.enum';

@ApiTags('Books/Topics')
@Controller()
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  // * ######  GET /books/topics ######
  @ApiOperation({
    summary: 'Get all the topics',
    description: 'Get all the topics.',
  })
  @ApiOkResponse({
    description: 'The topics.',
    type: [Topic],
  })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(): Promise<Topic[]> {
    return this.topicsService.findAll();
  }

  // * ######  GET /books/topics/:id ######
  @ApiOperation({
    summary: 'Get a topic by id',
    description: 'Get a topic by id.',
  })
  @ApiOkResponse({
    description: 'The topic.',
    type: Topic,
  })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Topic> {
    return this.topicsService.findOneById(+id);
  }

  // * ######  GET /books/topics/:id/books ######
  @ApiOperation({
    summary: 'Get all the books of one topic',
    description: 'Get all the books of one topic.',
  })
  @ApiOkResponse({
    description: 'The books.',
    type: [Book],
  })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Get(':id/books')
  findBooksByTopic(@Param('id') id: number): Promise<Book[]> {
    return this.topicsService.findBooksByTopic(+id);
  }

  // * ######  POST /books/topics (Auth)[Admin, Store] ######
  @ApiOperation({
    summary: 'Create a topic',
    description: 'Create a topic.',
  })
  @ApiCreatedResponse({
    description: 'The topic.',
    type: Topic,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is not logged in.',
  })
  @ApiForbiddenResponse({
    description: "The user hasn't the right role (store or admin).",
  })
  @ApiBearerAuth()
  @Roles(RolesEnum.store, RolesEnum.admin)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createTopicDto: CreateTopicDto): Promise<Topic> {
    return this.topicsService.create(createTopicDto);
  }

  // * ######  PATCH /books/topics/:id (Auth)[Admin, Store] ######
  @ApiOperation({
    summary: 'Update a topic',
    description: 'Update a topic.',
  })
  @ApiNoContentResponse({
    description: 'The topic has been updated.',
  })
  @ApiUnauthorizedResponse({
    description: 'The user is not logged in.',
  })
  @ApiForbiddenResponse({
    description: "The user hasn't the right role (store or admin).",
  })
  @ApiBearerAuth()
  @Roles(RolesEnum.store, RolesEnum.admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateTopicDto: UpdateTopicDto,
  ): Promise<void> {
    const result = await this.topicsService.update(id, updateTopicDto);
    if (!result) {
      throw new NotFoundException('Topic not found');
    }
  }

  // * ######  DELETE /books/topics/:id (Auth)[Admin, Store] ######
  @ApiOperation({
    summary: 'Delete a topic',
    description: 'Delete a topic.',
  })
  @ApiNoContentResponse({
    description: 'The topic has been deleted.',
  })
  @ApiUnauthorizedResponse({
    description: 'The user is not logged in.',
  })
  @ApiForbiddenResponse({
    description: "The user hasn't the right role (admin).",
  })
  @ApiBearerAuth()
  @Roles(RolesEnum.admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    const result = await this.topicsService.delete(id);
    if (!result) {
      throw new NotFoundException('Topic not found');
    }
  }
}
