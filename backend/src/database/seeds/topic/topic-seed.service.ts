import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topic } from 'src/books/topics/entities/topic.entity';

@Injectable()
export class TopicSeedService {
  constructor(
    @InjectRepository(Topic)
    private repository: Repository<Topic>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (count === 0) {
      await this.repository.save(
        this.repository.create({
          topic: 'fiction',
        }),
      );
      await this.repository.save(
        this.repository.create({
          topic: 'history',
        }),
      );
      await this.repository.save(
        this.repository.create({
          topic: 'fantasy',
        }),
      );
      await this.repository.save(
        this.repository.create({
          topic: 'mystery',
        }),
      );
    }
  }
}
