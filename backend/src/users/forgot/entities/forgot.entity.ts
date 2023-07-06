import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../entities/user.entity';
import { EntityHelper } from 'src/utils/entities/entity-helper.entity';

@Entity('Forgot')
export class Forgot extends EntityHelper {
  @ApiProperty({ example: 1, description: 'The id of the forgot instance' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1, description: 'The id of the user' })
  @Index()
  @Column({
    type: 'int',
    nullable: false,
  })
  user_id: number;

  @ApiProperty({
    example: 'AF1D2E3F4G5H6I7J8K9L',
    description: 'The hash of the forgot instance',
  })
  @Column({ type: 'text', nullable: false })
  @Index()
  hash: string;

  // * Dates
  @ApiProperty({
    example: '2021-01-01',
    description: 'The date when the forgot instance was created',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2021-01-01',
    description: 'The date when the forgot instance was deleted',
  })
  @DeleteDateColumn()
  deletedAt: Date;

  // * Relations
  @ManyToOne(() => User, (user) => user.forgots, {
    eager: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
