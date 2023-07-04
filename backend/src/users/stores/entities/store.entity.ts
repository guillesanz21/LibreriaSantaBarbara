import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityHelper } from 'src/utils/entities/entity-helper.entity';
import { Book } from '../../../books/entities/book.entity';
import { User } from '../../entities/user.entity';

@Entity('Store')
export class Store extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({
    type: 'int',
    nullable: false,
    unique: true,
  })
  user_id: number;

  @Column({ type: 'boolean', nullable: false, default: false })
  approved: boolean;

  @Index()
  @Column({ type: 'text', nullable: false, unique: true })
  name: string;

  @CreateDateColumn({ type: 'date', nullable: false })
  last_activity: Date;

  // * Dates
  @UpdateDateColumn({ type: 'date', nullable: true })
  updated_at: Date;

  // * Relations
  @OneToOne(() => User, (user) => user.store, {
    eager: true,
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Book, (book) => book.store)
  books: Book[];
}
