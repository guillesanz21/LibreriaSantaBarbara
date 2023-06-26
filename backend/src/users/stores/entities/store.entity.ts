import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Book } from '../../../books/entities/book.entity';
import { EntityHelper } from 'src/utils/entities/entity-helper.entity';

@Entity('Store')
export class Store extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, default: false })
  is_admin: boolean;

  @Column({ type: 'text', nullable: false, unique: true })
  email: string;

  @Column({ type: 'text', nullable: false })
  password: string;

  @Column({ type: 'text', nullable: false, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true, unique: true })
  NIF: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'text', nullable: false })
  phone_number: string;

  @CreateDateColumn({ type: 'date', nullable: false })
  last_activity: Date;

  @OneToMany(() => Book, (book) => book.store)
  books: Book[];

  @CreateDateColumn({ type: 'date', nullable: false })
  created_at: Date;

  @UpdateDateColumn({ type: 'date', nullable: true })
  updated_at: Date;

  @DeleteDateColumn({ type: 'date', nullable: true })
  deleted_at: Date;
}
