import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDefined, IsNotEmpty, Length } from 'class-validator';
import { IsExists } from 'src/utils/validators/isExists.validator';
import { IsISO6391 } from 'src/utils/validators/isISO6391.validator';
import { bookConstraints as constraints } from 'src/config/constants/database.constraint_values';

export class CreateLanguageDto {
  @ApiProperty({
    example: 1,
    description: 'The id of the book',
  })
  @IsDefined()
  @IsExists('Book', 'id')
  book_id: number;

  @ApiProperty({
    example: 'EN',
    description: 'The language of the book',
  })
  @Transform(({ value }) => value.toUpperCase())
  @IsNotEmpty()
  @Length(constraints.language.length, constraints.language.length)
  @IsISO6391()
  language: string;
}
