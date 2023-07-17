import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Keyword } from './entities/keyword.entity';
import { BulkCreateKeywordDto } from './dtos/create-keyword.dto';

@Injectable()
export class KeywordsService {
  constructor(
    @InjectRepository(Keyword)
    private readonly keywordsRepository: Repository<Keyword>,
  ) {}

  // * [C] Create
  // Bulk create keywords from array of names and return the created keywords
  bulkCreate(keywords: BulkCreateKeywordDto[]): Keyword[] {
    return keywords.map((keyword) => this.keywordsRepository.create(keyword));
  }
}
