import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { IsUnique } from 'src/utils/validators/isUnique.validator';
import { bookConstraints as constraints } from 'src/config/constants/database.constraint_values';

export class CreateLocationDto {
  @ApiProperty({
    example: 'Storage 1',
    description: 'The location of the book',
  })
  @IsNotEmpty()
  @MaxLength(constraints.location.maxLength)
  @IsUnique('Location')
  location: string;
}
