import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { EntityHelper } from 'src/utils/entities/entity-helper.entity';
import { Book } from '../../entities/book.entity';

@Entity('Location')
export class Location extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false, unique: true })
  location: string;

  @OneToMany(() => Book, (book) => book.location)
  books: Book[];
}
