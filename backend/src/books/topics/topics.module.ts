import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic } from './entities/topic.entity';
import { TopicsService } from './topics.service';
import { TopicsController } from './topics.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Topic])],
  providers: [TopicsService],
  controllers: [TopicsController],
})
export class TopicsModule {}
