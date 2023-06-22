import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { EntityHelper } from 'src/utils/entity-helper';
import { Book } from '../../entities/book.entity';

@Entity('Status')
export class Status extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false, unique: true })
  status: string;

  @OneToMany(() => Book, (book) => book.status)
  books: Book[];
}
