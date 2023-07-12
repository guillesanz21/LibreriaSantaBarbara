import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
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
import { ExposeGroupsEnum } from 'src/utils/types/expose-groups.enum';

@Entity('Store')
export class Store extends EntityHelper {
  @ApiProperty({ example: 1, description: 'The id of the store' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1, description: 'The id of the user' })
  @Index()
  @Column({
    type: 'int',
    nullable: false,
    unique: true,
  })
  user_id: number;

  @ApiProperty({
    example: false,
    description: 'Store approval store by a admin',
  })
  @Expose({ groups: [ExposeGroupsEnum.me, ExposeGroupsEnum.admin] })
  @Column({ type: 'boolean', nullable: false, default: false })
  approved: boolean;

  @ApiProperty({ example: 'Store name', description: 'The name of the store' })
  @Index()
  @Column({ type: 'text', nullable: false, unique: true })
  name: string;

  // * Dates
  @ApiProperty({
    example: '2021-01-01',
    description: 'Date when the store has interactuated with the app',
  })
  @Expose({ groups: [ExposeGroupsEnum.me, ExposeGroupsEnum.admin] })
  @CreateDateColumn({ type: 'date', nullable: false })
  last_activity: Date;

  @ApiProperty({
    example: null,
    description: 'Date when the store has been updated',
  })
  @Expose({ groups: [ExposeGroupsEnum.me, ExposeGroupsEnum.admin] })
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
