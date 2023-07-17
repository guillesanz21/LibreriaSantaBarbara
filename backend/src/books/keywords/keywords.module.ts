import { Module } from '@nestjs/common';
import { KeywordsService } from './keywords.service';
import { Keyword } from './entities/keyword.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Keyword])],
  providers: [KeywordsService],
  exports: [KeywordsService],
})
export class KeywordsModule {}
