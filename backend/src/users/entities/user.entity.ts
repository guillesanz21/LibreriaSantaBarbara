import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  // OneToMany,
} from 'typeorm';
import { EntityHelper } from 'src/utils/entity-helper';

export abstract class User extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, default: false })
  is_admin: boolean;

  @Column({ type: 'text', nullable: false, unique: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'text', nullable: false })
  phone_number: string;

  @CreateDateColumn({ type: 'date', nullable: false })
  created_at: Date;

  @UpdateDateColumn({ type: 'date', nullable: false })
  updated_at: Date;
}
