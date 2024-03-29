import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { IsUnique } from 'src/utils/validators/isUnique.validator';
import { bookConstraints as constraints } from 'src/config/constants/database.constraint_values';

export class CreateStatusDto {
  @ApiProperty({
    example: 'Available',
    description: 'The status of the book',
  })
  @IsNotEmpty()
  @MaxLength(constraints.status.maxLength)
  @IsUnique('Status')
  status: string;
}
