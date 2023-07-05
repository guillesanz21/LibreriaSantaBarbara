import { Expose } from 'class-transformer';
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

  @Column({ type: 'int', nullable: false, unique: true })
  @Index()
  user_id: number;

  // TODO: Make this column global for all users
  @Expose({ groups: ['me', 'admin'] })
  @Column({ nullable: false, default: false })
  email_confirmed: boolean;

  @Expose({ groups: ['me', 'admin'] })
  @Column({ default: AuthProvidersEnum.email })
  provider: string;

  @Expose({ groups: ['me', 'admin'] })
  @Column({ type: 'text', nullable: true, default: null })
  @Index()
  social_id: string;

  @Column({ type: 'text', nullable: true })
  first_name: string;

  @Column({ type: 'text', nullable: true })
  last_name: string;

  // * Dates
  @Expose({ groups: ['me', 'admin'] })
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
