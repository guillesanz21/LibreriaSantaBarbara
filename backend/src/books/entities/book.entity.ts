import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  Unique,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
  Index,
} from 'typeorm';
import { EntityHelper } from 'src/utils/entity-helper';
import { Store } from '../../users/entities/store.entity';
import { Location } from '../locations/entities/location.entity';
import { Status } from '../status/entities/status.entity';
import { Language } from '../languages/entites/language.entity';
import { Topic } from '../topics/entitites/topic.entity';
import { Keyword } from './keyword.entity';
import { Image } from './image.entity';

@Entity('Book')
@Unique(['store', 'ref'])
export class Book extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  ref: number;

  @Column({ type: 'text', nullable: false })
  ISBN: string;

  @Column({ type: 'text', nullable: false })
  title: string;

  @Column({ type: 'text', nullable: true })
  author: string;

  @Column({ type: 'text', nullable: true })
  publication_place: string;

  @Column({ type: 'text', nullable: true })
  publisher: string;

  @Column({ type: 'text', nullable: true })
  collection: string;

  @Column({ nullable: true })
  year: number;

  @Column({ type: 'text', nullable: true })
  size: string;

  @Column({ nullable: true })
  weight: number;

  @Column({ nullable: true })
  pages: number;

  @Column({ type: 'text', nullable: true })
  condition: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'numeric', nullable: false })
  price: number;

  @Column({ nullable: true, default: 1 })
  stock: number;

  @Column({ type: 'text', nullable: true })
  binding: string;

  @Column({ type: 'text', nullable: true })
  private_note: string;

  @ManyToOne(() => Store, (store) => store.books, {
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'store_id' })
  @Index()
  store: Store;

  @ManyToOne(() => Location, (location) => location.books, {
    nullable: true,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'location_id' })
  @Index()
  location: Location;

  @ManyToOne(() => Status, (status) => status.books, {
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'status_id' })
  @Index()
  status: Status;

  @OneToMany(() => Keyword, (keyword) => keyword.book)
  keywords: Keyword[];

  @OneToMany(() => Image, (image) => image.book)
  images: Image[];

  @OneToMany(() => Language, (language) => language.book)
  languages: Language[];

  @ManyToMany(() => Topic, (topic) => topic.books, {
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinTable({
    name: 'Topic_of_Book',
    joinColumn: { name: 'book_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'topic_id', referencedColumnName: 'id' },
  })
  topics: Topic[];

  @CreateDateColumn({ type: 'date', nullable: false })
  created_at: Date;

  @DeleteDateColumn({ type: 'date', nullable: true })
  sold_at: Date;
}
