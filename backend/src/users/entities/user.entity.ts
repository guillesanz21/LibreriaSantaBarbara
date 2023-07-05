import { Exclude, Expose, Transform } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { EntityHelper } from 'src/utils/entities/entity-helper.entity';
import { Forgot } from '../forgot/entities/forgot.entity';
import { Role } from '../roles/entities/role.entity';
import { User_Type } from '../user-types/entities/user_type.entity';
import { Store } from '../stores/entities/store.entity';
import { Customer } from '../customers/entities/customer.entity';

@Entity('User')
@Unique(['email', 'user_type'])
@Unique(['NIF', 'user_type'])
export class User extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  @Index()
  user_type_id: number;

  @Index()
  @Column({ type: 'int', nullable: false })
  role_id: number;

  @Expose({ groups: ['me', 'store', 'admin'] })
  @Index()
  @Column({ type: 'text', nullable: false })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'text', nullable: true })
  password: string;

  @Expose({ groups: ['me', 'store', 'admin'] })
  @Column({ type: 'text', nullable: true })
  NIF: string;

  @Expose({ groups: ['me', 'store', 'admin'] })
  @Column({ type: 'text', nullable: true })
  address: string;

  @Expose({ groups: ['me', 'store', 'admin'] })
  @Column({ type: 'text', nullable: true })
  phone_number: string;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'text', nullable: true, default: null })
  @Index()
  hash: string;

  // * Dates
  @Expose({ groups: ['me', 'admin'] })
  @CreateDateColumn({ type: 'date', nullable: false })
  created_at: Date;

  @Expose({ groups: ['me', 'admin'] })
  @UpdateDateColumn({ type: 'date', nullable: true })
  updated_at: Date;

  @Expose({ groups: ['me', 'admin'] })
  @DeleteDateColumn({ type: 'date', nullable: true })
  deleted_at: Date;

  // * Relations
  @Transform(({ value }) => value?.user_type)
  @ManyToOne(() => User_Type, (user_type) => user_type.users, {
    eager: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'user_type_id' })
  user_type: User_Type;

  @Transform(({ value }) => value?.role)
  @ManyToOne(() => Role, (role) => role.users, {
    eager: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @OneToMany(() => Forgot, (forgot) => forgot.user)
  forgots: Forgot[];

  @OneToOne(() => Store, (store) => store.user, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  store: Store;

  @OneToOne(() => Customer, (customer) => customer.user, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  customer: Customer;
}
