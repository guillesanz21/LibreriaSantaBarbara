import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Index,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { EntityHelper } from 'src/utils/entities/entity-helper.entity';
import { Book } from '../../entities/book.entity';
import { Store } from '../../../users/stores/entities/store.entity';
import { ExposeGroupsEnum } from 'src/utils/types/expose-groups.enum';

@Entity('Location')
@Unique(['location', 'store'])
export class Location extends EntityHelper {
  @ApiProperty({ example: 1, description: 'The id of the location' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 1,
    description: 'The id of the store where the location is',
  })
  @Column({ type: 'int', nullable: false, default: 1 })
  @Index()
  store_id: number;

  @ApiProperty({ example: 'Storage', description: 'The location' })
  @Expose({ groups: [ExposeGroupsEnum.me, ExposeGroupsEnum.admin] })
  @Column({ type: 'text', nullable: false, unique: true })
  location: string;

  // * Relations
  @ManyToOne(() => Store, (store) => store.books, {
    eager: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @OneToMany(() => Book, (book) => book.location)
  books: Book[];
}
