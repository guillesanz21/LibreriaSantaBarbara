import { ApiProperty } from '@nestjs/swagger';
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
import { ExposeGroupsEnum } from 'src/utils/types/expose-groups.enum';

@Entity('User')
@Unique(['email', 'user_type'])
@Unique(['NIF', 'user_type'])
export class User extends EntityHelper {
  @ApiProperty({ example: 1, description: 'The id of the user' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1, description: 'The id of the user type' })
  @Column({ type: 'int', nullable: false })
  @Index()
  user_type_id: number;

  @ApiProperty({ example: 1, description: 'The id of the role' })
  @Index()
  @Column({ type: 'int', nullable: false })
  role_id: number;

  @ApiProperty({
    example: 'example@example.com',
    description: 'The email of the user',
  })
  @Expose({
    groups: [
      ExposeGroupsEnum.me,
      ExposeGroupsEnum.store,
      ExposeGroupsEnum.admin,
    ],
  })
  @Index()
  @Column({ type: 'text', nullable: false })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'text', nullable: true })
  password: string;

  @ApiProperty({ example: '12345678A', description: 'The NIF of the user' })
  @Expose({
    groups: [
      ExposeGroupsEnum.me,
      ExposeGroupsEnum.store,
      ExposeGroupsEnum.admin,
    ],
  })
  @Column({ type: 'text', nullable: true })
  NIF: string;

  @ApiProperty({
    example: 'Calle Princesa 12B',
    description: 'The address of the user',
  })
  @Expose({
    groups: [
      ExposeGroupsEnum.me,
      ExposeGroupsEnum.store,
      ExposeGroupsEnum.admin,
    ],
  })
  @Column({ type: 'text', nullable: true })
  address: string;

  @ApiProperty({ example: '+34661122334', description: 'The phone number' })
  @Expose({
    groups: [
      ExposeGroupsEnum.me,
      ExposeGroupsEnum.store,
      ExposeGroupsEnum.admin,
    ],
  })
  @Column({ type: 'text', nullable: true })
  phone_number: string;

  @ApiProperty({
    example: false,
    description: 'The email confirmation status of the user',
  })
  @Expose({ groups: [ExposeGroupsEnum.me, ExposeGroupsEnum.admin] })
  @Column({ nullable: false, default: false })
  email_confirmed: boolean;

  @ApiProperty({
    example: null,
    description: 'Hash used to verify email at registration',
  })
  @Exclude({ toPlainOnly: true })
  @Column({ type: 'text', nullable: true, default: null })
  @Index()
  hash: string;

  // * Dates
  @ApiProperty({
    example: '2021-01-01',
    description: 'The date when the user was created',
  })
  @Expose({ groups: [ExposeGroupsEnum.me, ExposeGroupsEnum.admin] })
  @CreateDateColumn({ type: 'date', nullable: false })
  created_at: Date;

  @ApiProperty({
    example: null,
    description: 'The date when the user has been updated',
  })
  @Expose({ groups: [ExposeGroupsEnum.me, ExposeGroupsEnum.admin] })
  @UpdateDateColumn({ type: 'date', nullable: true })
  updated_at: Date;

  @ApiProperty({
    example: null,
    description: 'The date when the user has been (soft) deleted',
  })
  @Expose({ groups: [ExposeGroupsEnum.me, ExposeGroupsEnum.admin] })
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
