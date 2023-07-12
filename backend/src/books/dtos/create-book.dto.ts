import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDefined,
  IsOptional,
  IsNumber,
  IsDate,
  IsISBN,
  MaxLength,
  Max,
  Min,
  IsUrl,
  IsNotEmpty,
} from 'class-validator';
import { IsExists } from 'src/utils/validators/isExists.validator';
import { IsCompositeUnique } from 'src/utils/validators/isCompositeUnique.validator';
import { bookConstraints as constraints } from 'src/config/constants/database.constraint_values';
import { IBook } from '../interfaces/book.interface';

export class CreateBookDto implements IBook {
  @ApiPropertyOptional({
    example: 1,
    description: 'The id of the store that have the book',
  })
  @IsOptional()
  @IsNumber()
  @IsExists('Store', 'id')
  store_id?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'The id of the location where book is stored',
  })
  @IsOptional()
  @IsNumber()
  @IsExists('Location', 'id')
  location_id?: number;

  @ApiProperty({
    example: 1,
    description: 'The id of the status of the book',
  })
  @IsDefined()
  @IsNumber()
  @IsExists('Status', 'id')
  status_id: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'The external id/reference of the book',
  })
  @IsOptional()
  @Min(constraints.ref.min)
  @IsCompositeUnique('Book', 'store_id')
  ref?: number;

  @ApiProperty({
    example: '9789720046957',
    description: 'The ISBN (13/9) of the book',
  })
  @Transform(({ value }) => value.replace(/-/g, ''))
  @IsNotEmpty()
  @IsISBN()
  ISBN: string;

  @ApiProperty({
    example: 'The Lord of the Rings',
    description: 'The title of the book',
  })
  @IsNotEmpty()
  @MaxLength(constraints.title.maxLength)
  title: string;

  @ApiPropertyOptional({
    example: 'J. R. R. Tolkien',
    description: 'The author of the book',
  })
  @IsOptional()
  @MaxLength(constraints.author.maxLength)
  author?: string;

  @ApiPropertyOptional({
    example: 'Portugal',
    description: 'The publication place (country, region, etc.) of the book',
  })
  @IsOptional()
  @MaxLength(constraints.publication_place.maxLength)
  publication_place?: string;

  @ApiPropertyOptional({
    example: 'Círculo de Leitores',
    description: 'The publisher of the book',
  })
  @IsOptional()
  @MaxLength(constraints.publisher.maxLength)
  publisher?: string;

  @ApiPropertyOptional({
    example: 'Colecção: Obras de J. R. R. Tolkien',
    description: 'The collection of the book',
  })
  @IsOptional()
  @MaxLength(constraints.collection.maxLength)
  collection?: string;

  @ApiPropertyOptional({
    example: 2012,
    description: 'The publication year of the book',
  })
  @IsOptional()
  @Max(2055)
  year?: number;

  @ApiPropertyOptional({
    example: '20x13',
    description: 'The size of the book (height x width)',
  })
  @IsOptional()
  @MaxLength(constraints.size.maxLength)
  size?: string;

  @ApiPropertyOptional({
    example: 500,
    description: 'The weight of the book (in grams)',
  })
  @IsOptional()
  @Min(constraints.weight.min)
  weight?: number;

  @ApiPropertyOptional({
    example: 500,
    description: 'The number of pages of the book',
  })
  @IsOptional()
  @Min(constraints.pages.min)
  pages?: number;

  @ApiPropertyOptional({
    example: 'With dust jacket',
    description: 'The condition of the book',
  })
  @IsOptional()
  @MaxLength(constraints.condition.maxLength)
  condition?: string;

  @ApiPropertyOptional({
    example: 'The Lord of the Rings is an epic high-fantasy novel',
    description: 'The description of the book',
  })
  @IsOptional()
  @MaxLength(constraints.description.maxLength)
  description?: string;

  @ApiPropertyOptional({
    example: 30,
    description: 'The price of the book (euros)',
  })
  @IsDefined()
  @Min(constraints.price.min)
  price: number;

  @ApiPropertyOptional({
    example: 2,
    description: 'The stock of the book',
  })
  @IsOptional()
  @Min(constraints.stock.min)
  stock?: number;

  @ApiPropertyOptional({
    example: 'Hardcover',
    description: 'The binding of the book',
  })
  @IsOptional()
  @MaxLength(constraints.binding.maxLength)
  binding?: string;

  @ApiPropertyOptional({
    example: 'Erase the pencil marks',
    description: 'A private note that only the store can see',
  })
  @IsOptional()
  @MaxLength(constraints.private_note.maxLength)
  private_note?: string;

  @ApiPropertyOptional({
    example: '2021-01-01',
    description: 'The date when the book was sold',
  })
  @IsOptional()
  @IsDate()
  sold_at?: Date;

  @ApiPropertyOptional({
    example: ['used', 'adventure', 'epic'],
    description: 'The keywords of the book',
  })
  @IsOptional()
  @MaxLength(constraints.keyword.maxLength, {
    each: true,
  })
  keywords?: string[];

  @ApiPropertyOptional({
    example: ['https://example.com/image1.jpg'],
    description: 'The images of the book',
  })
  @IsOptional()
  @IsUrl({}, { each: true })
  images?: string[];

  @ApiPropertyOptional({
    example: ['fantasy', 'adventure', 'epic'],
    description: 'The topics of the book',
  })
  @IsOptional()
  @Transform(({ value }) => value.map((topic: string) => topic?.toLowerCase()))
  @MaxLength(constraints.topic.maxLength, { each: true })
  topics?: string[];
}
