import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { bookConstraints as constraints } from 'src/config/constants/database.constraint_values';
import { IsExists } from 'src/utils/validators/isExists.validator';

export class CreateKeywordDto {
  @ApiProperty({
    example: 1,
    description: 'The id of the book',
  })
  @IsDefined()
  @IsExists('Book', 'id')
  book_id: number;

  @ApiProperty({
    example: 'trending',
    description: 'A keyword associated with the book',
  })
  @IsNotEmpty()
  @MaxLength(constraints.keyword.maxLength)
  keyword: string;
}

export class BulkCreateKeywordDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'The id of the book',
  })
  @IsOptional()
  @IsExists('Book', 'id')
  book_id?: number;

  @ApiProperty({
    example: 'trending',
    description: 'A keyword associated with the book',
  })
  @IsNotEmpty()
  @MaxLength(constraints.keyword.maxLength)
  keyword: string;
}
