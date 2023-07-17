import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topic } from './entities/topic.entity';
import { Book } from '../books/entities/book.entity';
import { BulkCreateTopicDto, CreateTopicDto } from './dtos/create-topic.dto';
import { UpdateTopicDto } from './dtos/update-topic.dto';
import { NullableType } from 'src/utils/types/nullable.type';

@Injectable()
export class TopicsService {
  constructor(
    @InjectRepository(Topic)
    private readonly topicsRepository: Repository<Topic>,
  ) {}

  // * [C] Create
  // Create a topic
  async create(topic: CreateTopicDto): Promise<Topic> {
    const createdTopic = await this.topicsRepository.insert(
      this.topicsRepository.create(topic),
    );
    return createdTopic.raw;
  }

  // Bulk create
  async bulkCreate(topicsToCreate: BulkCreateTopicDto[]): Promise<Topic[]> {
    const topics: Topic[] = [];
    for (const topic of topicsToCreate) {
      const topicExists = await this.topicsRepository.findOne({
        where: { topic: topic.topic },
      });
      if (topicExists) {
        topics.push(topicExists);
      } else {
        const createdTopic = this.topicsRepository.create(topic);
        topics.push(createdTopic);
      }
    }
    return topics;
  }

  // * [R] Read
  // Find a topic by its id
  async findOneById(id: number): Promise<NullableType<Topic>> {
    return this.topicsRepository.findOne({ where: { id: +id } });
  }

  // Find all the topics
  async findAll(): Promise<Topic[]> {
    return this.topicsRepository.find();
  }

  // Find many topics by name
  async findMany(topic: string): Promise<Topic[]> {
    return this.topicsRepository.find({ where: { topic } });
  }

  // Find the books of a topic
  async findBooksByTopic(topic_id: number): Promise<NullableType<Book[]>> {
    return this.topicsRepository
      .createQueryBuilder('topic')
      .leftJoin('topic.books', 'Book')
      .where('topic.id = :id', { id: topic_id })
      .getMany() as unknown as Book[];
  }

  // * [U] Update methods
  // Update a topic
  async update(topic_id: number, topic: UpdateTopicDto): Promise<boolean> {
    const result = await this.topicsRepository.update(topic_id, topic);
    return result.affected > 0;
  }

  // * [D] Delete methods
  // Delete (hard) a topic
  async delete(topic_id: number): Promise<boolean> {
    const result = await this.topicsRepository.delete(topic_id);
    return result.affected > 0;
  }
}
