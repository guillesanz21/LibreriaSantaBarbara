import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { EntityHelper } from 'src/utils/entities/entity-helper.entity';

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

  @UpdateDateColumn({ type: 'date', nullable: true })
  updated_at: Date;

  @DeleteDateColumn({ type: 'date', nullable: true })
  deleted_at: Date;
}
