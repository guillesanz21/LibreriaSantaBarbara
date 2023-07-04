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
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({
    type: 'int',
    nullable: false,
  })
  user_id: number;

  @Column({ type: 'text', nullable: false })
  @Index()
  hash: string;

  // * Dates
  @CreateDateColumn()
  createdAt: Date;

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
