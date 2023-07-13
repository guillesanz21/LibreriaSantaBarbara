import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic } from 'src/books/topics/entities/topic.entity';
import { TopicSeedService } from './topic-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Topic])],
  providers: [TopicSeedService],
  exports: [TopicSeedService],
})
export class TopicSeedModule {}
