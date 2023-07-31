import { ApiProperty } from '@nestjs/swagger';
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
  UpdateDateColumn,
} from 'typeorm';
import { Exclude, Expose, Transform } from 'class-transformer';
import { EntityHelper } from 'src/utils/entities/entity-helper.entity';
import { Store } from '../../../users/stores/entities/store.entity';
import { Location } from '../../locations/entities/location.entity';
import { Status } from '../../status/entities/status.entity';
import { Language } from '../../languages/entites/language.entity';
import { Topic } from '../../topics/entities/topic.entity';
import { Keyword } from '../../keywords/entities/keyword.entity';
import { Image } from '../../images/entities/image.entity';
import { ExposeGroupsEnum } from 'src/utils/types/expose-groups.enum';

@Entity('Book')
@Unique(['ref', 'store'])
export class Book extends EntityHelper {
  @ApiProperty({ example: 1, description: 'The internal id of the book' })
  @Expose({ groups: [ExposeGroupsEnum.me, ExposeGroupsEnum.admin] })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 1,
    description: 'The id of the store that have the book',
  })
  @Column({ type: 'int', nullable: false, default: 1 })
  @Index()
  store_id: number;

  @ApiProperty({
    example: 1,
    description: 'The id of the location where book is stored',
  })
  @Exclude({ toPlainOnly: true })
  @Column({ type: 'int', nullable: true })
  @Index()
  location_id: number;

  @ApiProperty({
    example: 1,
    description: 'The id of the status of the book',
  })
  @Exclude({ toPlainOnly: true })
  @Column({ type: 'int', nullable: false, default: 1 })
  @Index()
  status_id: number;

  @ApiProperty({
    example: 1,
    description: 'The external id/reference of the book',
  })
  @Column({ nullable: false })
  ref: number;

  @ApiProperty({
    example: '9781250788450',
    description: 'The ISBN (13/10) of the book',
  })
  @Column({ type: 'text', nullable: true })
  ISBN: string;

  @ApiProperty({
    example: 'The Lord of the Rings',
    description: 'The title of the book',
  })
  @Column({ type: 'text', nullable: false })
  title: string;

  @ApiProperty({
    example: 'J. R. R. Tolkien',
    description: 'The author of the book',
  })
  @Column({ type: 'text', nullable: true })
  author: string;

  @ApiProperty({
    example: 'Portugal',
    description: 'The publication place (country, region, etc.) of the book',
  })
  @Column({ type: 'text', nullable: true })
  publication_place: string;

  @ApiProperty({
    example: 'Círculo de Leitores',
    description: 'The publisher of the book',
  })
  @Column({ type: 'text', nullable: true })
  publisher: string;

  @ApiProperty({
    example: 'Colecção: Obras de J. R. R. Tolkien',
    description: 'The collection of the book',
  })
  @Column({ type: 'text', nullable: true })
  collection: string;

  @ApiProperty({
    example: 2012,
    description: 'The publication year of the book',
  })
  @Column({ nullable: true })
  year: number;

  @ApiProperty({
    example: '20x13',
    description: 'The size of the book (height x width)',
  })
  @Column({ type: 'text', nullable: true })
  size: string;

  @ApiProperty({
    example: 500,
    description: 'The weight of the book (in grams)',
  })
  @Column({ nullable: true })
  weight: number;

  @ApiProperty({
    example: 500,
    description: 'The number of pages of the book',
  })
  @Column({ nullable: true })
  pages: number;

  @ApiProperty({
    example: 'With dust jacket',
    description: 'The condition of the book',
  })
  @Column({ type: 'text', nullable: true })
  condition: string;

  @ApiProperty({
    example: 'The Lord of the Rings is an epic high-fantasy novel',
    description: 'The description of the book',
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    example: 30,
    description: 'The price of the book (euros)',
  })
  @Column({ nullable: false })
  price: number;

  @ApiProperty({
    example: 2,
    description: 'The stock of the book',
  })
  @Column({ nullable: true, default: 1 })
  stock: number;

  @ApiProperty({
    example: 'Hardcover',
    description: 'The type of binding of the book',
  })
  @Column({ type: 'text', nullable: true })
  binding: string;

  @ApiProperty({
    example: 'Erase the pencil marks',
    description: 'A private note that only the store can see',
  })
  @Expose({ groups: [ExposeGroupsEnum.me, ExposeGroupsEnum.admin] })
  @Column({ type: 'text', nullable: true })
  private_note: string;

  // * Dates
  @ApiProperty({
    example: '2021-01-01',
    description: 'The date when the book was created',
  })
  @Expose({ groups: [ExposeGroupsEnum.me, ExposeGroupsEnum.admin] })
  @CreateDateColumn({ type: 'date', nullable: false })
  created_at: Date;

  @ApiProperty({
    example: null,
    description: 'Date when the book has been updated',
  })
  @Expose({ groups: [ExposeGroupsEnum.me, ExposeGroupsEnum.admin] })
  @UpdateDateColumn({ type: 'date', nullable: true })
  updated_at: Date;

  @ApiProperty({
    example: null,
    description: 'The date when the book has been sold',
  })
  @Expose({ groups: [ExposeGroupsEnum.me, ExposeGroupsEnum.admin] })
  @Column({ type: 'date', nullable: true })
  sold_at: Date;

  @ApiProperty({
    example: null,
    description: 'The date when the book has been (soft) deleted',
  })
  @Expose({ groups: [ExposeGroupsEnum.me, ExposeGroupsEnum.admin] })
  @DeleteDateColumn({ type: 'date', nullable: true })
  deleted_at: Date;

  // * Relations
  @ManyToOne(() => Store, (store) => store.books, {
    eager: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Transform(({ value }) => ({ id: value?.id, location: value?.location }))
  @Expose({ groups: [ExposeGroupsEnum.me, ExposeGroupsEnum.admin] })
  @ManyToOne(() => Location, (location) => location.books, {
    eager: true,
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'location_id' })
  location: Location;

  // @Transform(({ value }) => value?.status)
  @ManyToOne(() => Status, (status) => status.books, {
    eager: true,
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'status_id' })
  status: Status;

  @OneToMany(() => Keyword, (keyword) => keyword.book, {
    eager: true,
    cascade: true,
  })
  keywords: Keyword[];

  @OneToMany(() => Image, (image) => image.book, {
    eager: true,
    cascade: true,
  })
  images: Image[];

  @OneToMany(() => Language, (language) => language.book, {
    eager: true,
    cascade: true,
  })
  languages: Language[];

  @ManyToMany(() => Topic, (topic) => topic.books, {
    eager: true,
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'Topic_of_Book',
    joinColumn: { name: 'book_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'topic_id', referencedColumnName: 'id' },
  })
  topics: Topic[];
}
