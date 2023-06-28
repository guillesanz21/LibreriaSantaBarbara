import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityHelper } from 'src/utils/entities/entity-helper.entity';
import { AuthProvidersEnum } from 'src/auth/auth.types';

@Entity('Customer')
export class Customer extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, default: false })
  is_admin: boolean;

  @Index()
  @Column({ type: 'text', nullable: false, unique: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  password: string;

  @Column({ default: AuthProvidersEnum.email })
  provider: string;

  @Index()
  @Column({ type: 'text', nullable: true, default: null })
  social_id: string;

  @Column({ type: 'text', nullable: true })
  first_name: string;

  @Column({ type: 'text', nullable: true })
  last_name: string;

  @Index()
  @Column({ type: 'text', nullable: true, unique: true })
  DNI: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'text', nullable: true })
  phone_number: string;

  @Column({ type: 'text', nullable: true, default: null })
  @Index()
  hash: string;

  @Column({ nullable: false, default: false })
  email_confirmed: boolean;

  @CreateDateColumn({ type: 'date', nullable: false })
  created_at: Date;

  @UpdateDateColumn({ type: 'date', nullable: true })
  updated_at: Date;

  @DeleteDateColumn({ type: 'date', nullable: true })
  deleted_at: Date;
}
