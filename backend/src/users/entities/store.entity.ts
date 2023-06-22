import { Column, CreateDateColumn, Entity, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Book } from '../../books/entities/book.entity';

@Entity('Store')
export class Store extends User {
  @Column({ type: 'text', nullable: false })
  password: string;

  @Column({ type: 'text', nullable: false, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true, unique: true })
  NIF: string;

  @CreateDateColumn({ type: 'date', nullable: false })
  last_activity: Date;

  @OneToMany(() => Book, (book) => book.store)
  books: Book[];
}
