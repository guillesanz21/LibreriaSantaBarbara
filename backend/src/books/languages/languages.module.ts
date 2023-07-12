import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsISO6391Constraint } from 'src/utils/validators/isISO6391.validator';
import { Language } from './entites/language.entity';
import { LanguagesService } from './languages.service';
import { LanguagesController } from './languages.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Language])],
  providers: [IsISO6391Constraint, LanguagesService],
  controllers: [LanguagesController],
})
export class LanguagesModule {}
