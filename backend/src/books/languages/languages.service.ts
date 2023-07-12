import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  LocalizedLanguageNames,
  getName,
  getNames,
} from '@cospired/i18n-iso-languages';
import { Language } from './entites/language.entity';
import { CreateLanguageDto } from './dtos/create-language.dto';

@Injectable()
export class LanguagesService {
  private lang: string;

  constructor(
    @InjectRepository(Language)
    private readonly languagesRepository: Repository<Language>,
  ) {
    // TODO: Get the user configuration's language when it's implemented. Default to 'es'
    this.lang = 'es';
  }

  // Find a language by its id
  async findOneById(id: number): Promise<Language | undefined> {
    return this.languagesRepository.findOne({ where: { id: +id } });
  }

  // Find the languages of a book
  async findBookLanguages(bookId: number): Promise<Language[]> {
    return this.languagesRepository.find({ where: { book_id: +bookId } });
  }

  // Create a language
  async create(langDto: CreateLanguageDto): Promise<Language> {
    const lang = this.languagesRepository.create(langDto);
    return this.languagesRepository.save(lang);
  }

  // Delete (hard) a language
  async delete(id: number): Promise<void> {
    await this.languagesRepository.delete(id);
  }

  // Get all languages
  getAllStatic(): LocalizedLanguageNames {
    return getNames(this.lang);
  }

  // Get most used languages
  getMostUsedStatic(): LocalizedLanguageNames {
    const mostUsed = ['ES', 'EN', 'CA', 'GL', 'EU', 'FR', 'DE', 'IT', 'PT'];
    // Return the most used languages, the key is the alpha2 code and the value is the name
    return mostUsed.reduce((acc, cur) => {
      acc[cur] = getName(cur, this.lang);
      return acc;
    }, {});
  }

  // Get a language by its alpha2 code
  getOneStatic(alpha2: string): string | undefined {
    return getName(alpha2, this.lang);
  }
}
