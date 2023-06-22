import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { EntityHelper } from 'src/utils/entity-helper';
import { Book } from './book.entity';

@Entity('Keyword')
export class Keyword extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Book, (book) => book.keywords, {
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'book_id' })
  @Index()
  book: Book;

  @Column({ type: 'text', nullable: false })
  keyword: string;
}
