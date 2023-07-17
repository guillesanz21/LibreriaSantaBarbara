import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { IsUnique } from 'src/utils/validators/isUnique.validator';
import { bookConstraints as constraints } from 'src/config/constants/database.constraint_values';

export class CreateTopicDto {
  @ApiProperty({
    example: 'Fiction',
    description: 'The topic of the book',
  })
  @IsNotEmpty()
  @Transform(({ value }) => value?.toLowerCase())
  @MaxLength(constraints.topic.maxLength)
  @IsUnique('Topic')
  topic: string;
}

export class BulkCreateTopicDto {
  @ApiProperty({
    example: 'Fiction',
    description: 'The topic of the book',
  })
  @IsNotEmpty()
  @Transform(({ value }) => value?.toLowerCase())
  @MaxLength(constraints.topic.maxLength)
  topic: string;
}
