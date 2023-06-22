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

@Entity('Image')
export class Image extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Book, (book) => book.images, {
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'book_id' })
  @Index()
  book: Book;

  @Column({ type: 'text', nullable: false })
  url: string;
}
