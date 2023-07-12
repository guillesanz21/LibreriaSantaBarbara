import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { EntityHelper } from 'src/utils/entities/entity-helper.entity';
import { Book } from './book.entity';

@Entity('Image')
export class Image extends EntityHelper {
  @ApiProperty({ example: 1, description: 'The id of the image' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 1,
    description: 'The id of the book that the image belongs to',
  })
  @Column({ type: 'int', nullable: false })
  @Index()
  book_id: number;

  @ApiProperty({
    example: 'https://example.com/image.png',
    description: 'The url of the image',
  })
  @Column({ type: 'text', nullable: false })
  url: string;

  // * Relations
  @ManyToOne(() => Book, (book) => book.images, {
    eager: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'book_id' })
  book: Book;
}
