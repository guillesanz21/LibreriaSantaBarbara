import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { EntityHelper } from 'src/utils/entity-helper';
import { Book } from '../../entities/book.entity';

@Entity('Topic')
export class Topic extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false, unique: true })
  topic: string;

  @ManyToMany(() => Book, (book) => book.topics)
  books: Book[];
}
