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
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { TopicsService } from './topics.service';
import { Topic } from './entitites/topic.entity';
import { Book } from '../entities/book.entity';
import { CreateTopicDto } from './dtos/create-topic.dto';
import { UpdateTopicDto } from './dtos/update-topic.dto';

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
  @HttpCode(HttpStatus.OK)
  @Get(':id/books')
  findBooksByTopic(@Param('id') id: number): Promise<Book[]> {
    return this.topicsService.findBooksByTopic(+id);
  }

  // * ######  POST /books/topics ######
  @ApiOperation({
    summary: 'Create a topic',
    description: 'Create a topic.',
  })
  @ApiOkResponse({
    description: 'The topic.',
    type: Topic,
  })
  @HttpCode(HttpStatus.OK)
  @Post()
  create(@Body() createTopicDto: CreateTopicDto): Promise<Topic> {
    return this.topicsService.create(createTopicDto);
  }

  // * ######  PATCH /books/topics/:id ######
  @ApiOperation({
    summary: 'Update a topic',
    description: 'Update a topic.',
  })
  @ApiOkResponse({
    description: 'The topic.',
    type: Topic,
  })
  @HttpCode(HttpStatus.OK)
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

  // * ######  DELETE /books/topics/:id ######
  @ApiOperation({
    summary: 'Delete a topic',
    description: 'Delete a topic.',
  })
  @ApiNoContentResponse({
    description: 'The topic.',
    type: Topic,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    const result = await this.topicsService.delete(id);
    if (!result) {
      throw new NotFoundException('Topic not found');
    }
  }
}
