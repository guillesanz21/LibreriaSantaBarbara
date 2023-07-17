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
import { Book } from '../../books/entities/book.entity';

@Entity('Language')
export class Language extends EntityHelper {
  @ApiProperty({ example: 1, description: 'The id of the language' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 1,
    description: 'The id of the book that the language references to',
  })
  @Column({ type: 'int', nullable: false })
  @Index()
  book_id: number;

  @ApiProperty({
    example: 'EN',
    description: 'ISO 639-1 Alpha-2 code of the language',
  })
  @Column({ type: 'text', nullable: false })
  language: string;

  // * Relations
  @ManyToOne(() => Book, (book) => book.languages, {
    eager: false,
    orphanedRowAction: 'delete',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'book_id' })
  book: Book;
}
