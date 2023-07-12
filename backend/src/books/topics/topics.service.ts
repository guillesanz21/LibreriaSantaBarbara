import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topic } from './entitites/topic.entity';
import { CreateTopicDto } from './dtos/create-topic.dto';
import { UpdateTopicDto } from './dtos/update-topic.dto';
import { MaybeType } from 'src/utils/types/maybe.type';
import { Book } from '../entities/book.entity';

@Injectable()
export class TopicsService {
  constructor(
    @InjectRepository(Topic)
    private readonly topicsRepository: Repository<Topic>,
  ) {}

  // Find a topic by its id
  async findOneById(id: number): Promise<MaybeType<Topic>> {
    return this.topicsRepository.findOne({ where: { id: +id } });
  }

  // Find all the topics
  async findAll(): Promise<Topic[]> {
    return this.topicsRepository.find();
  }

  // Find the topics of a book
  // TODO: Check if this works
  async findTopicsOfBook(book_id: number): Promise<Topic[]> {
    return this.topicsRepository
      .createQueryBuilder('topics')
      .leftJoin('book.topics', 'topics')
      .where('book.id = :id', { id: book_id })
      .getMany();
  }

  // Find the books of a topic
  // TODO: Check if this works
  async findBooksByTopic(topic_id: number): Promise<Book[]> {
    return this.topicsRepository
      .createQueryBuilder('books')
      .leftJoin('topic.books', 'books')
      .where('topic.id = :id', { id: topic_id })
      .getMany() as unknown as Book[];
  }

  // Create a topic
  async create(topic: CreateTopicDto): Promise<Topic> {
    return this.topicsRepository.save(this.topicsRepository.create(topic));
  }

  // Update a topic
  async update(topic_id: number, topic: UpdateTopicDto): Promise<Topic> {
    return this.topicsRepository.save(
      this.topicsRepository.create({ id: topic_id, ...topic }),
    );
  }

  // Delete (hard) a topic
  async delete(topic_id: number): Promise<boolean> {
    const result = await this.topicsRepository.delete(topic_id);
    return result.affected > 0;
  }
}
