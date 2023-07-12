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

@Entity('Keyword')
export class Keyword extends EntityHelper {
  @ApiProperty({ example: 1, description: 'The id of the keyword' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 1,
    description: 'The id of the book that the keyword references to',
  })
  @Column({ type: 'int', nullable: false })
  @Index()
  book_id: number;

  @ApiProperty({
    example: 'keyword',
    description: 'The keyword',
  })
  @Column({ type: 'text', nullable: false })
  keyword: string;

  // * Relations
  @ManyToOne(() => Book, (book) => book.keywords, {
    eager: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'book_id' })
  book: Book;
}
