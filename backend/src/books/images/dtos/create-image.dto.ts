import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';
import { IsExists } from 'src/utils/validators/isExists.validator';

export class CreateImageDto {
  @ApiProperty({
    example: 1,
    description: 'The id of the book',
  })
  @IsDefined()
  @IsExists('Book', 'id')
  book_id: number;

  @ApiProperty({
    example: 'https://example.com/image1.jpg',
    description: 'The image of the book',
  })
  @IsNotEmpty()
  // TODO: Validate file instead of url
  @IsUrl()
  image: string;
}

export class BulkCreateImageDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'The id of the book',
  })
  @IsOptional()
  @IsExists('Book', 'id')
  book_id?: number;

  @ApiProperty({
    example: 'https://example.com/image1.jpg',
    description: 'The image of the book',
  })
  @IsNotEmpty()
  // TODO: Validate file instead of url
  @IsUrl()
  image: string;
}
