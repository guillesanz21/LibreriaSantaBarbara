import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityHelper } from 'src/utils/entities/entity-helper.entity';
import { AuthProvidersEnum } from 'src/auth/auth.types';
import { User } from '../../entities/user.entity';

@Entity('Customer')
export class Customer extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'int', nullable: false, unique: true })
  user_id: number;

  // TODO: Make this column global for all users
  @Column({ nullable: false, default: false })
  email_confirmed: boolean;

  @Column({ default: AuthProvidersEnum.email })
  provider: string;

  @Index()
  @Column({ type: 'text', nullable: true, default: null })
  social_id: string;

  @Column({ type: 'text', nullable: true })
  first_name: string;

  @Column({ type: 'text', nullable: true })
  last_name: string;

  // * Dates
  @UpdateDateColumn({ type: 'date', nullable: true })
  updated_at: Date;

  // * Relations
  @OneToOne(() => User, (user) => user.customer, {
    eager: true,
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
