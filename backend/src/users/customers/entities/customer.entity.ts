import { ApiProperty } from '@nestjs/swagger';
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
import { ExposeGroupsEnum } from 'src/utils/types/expose-groups.enum';

@Entity('Customer')
export class Customer extends EntityHelper {
  @ApiProperty({ example: 1, description: 'The id of the customer' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1, description: 'The id of the user' })
  @Column({ type: 'int', nullable: false, unique: true })
  @Index()
  user_id: number;

  @ApiProperty({
    example: 'email',
    description: 'The login provider of the customer',
  })
  @Expose({ groups: [ExposeGroupsEnum.me, ExposeGroupsEnum.admin] })
  @Column({ default: AuthProvidersEnum.email })
  provider: string;

  @ApiProperty({
    example: null,
    description: 'The social id associated to a provider of the customer',
  })
  @Expose({ groups: [ExposeGroupsEnum.me, ExposeGroupsEnum.admin] })
  @Column({ type: 'text', nullable: true, default: null })
  @Index()
  social_id: string;

  @ApiProperty({
    example: 'John',
    description: 'The first name of the customer',
  })
  @Column({ type: 'text', nullable: true })
  first_name: string;

  @ApiProperty({
    example: 'Doe Doe',
    description: 'The last(s) name of the customer',
  })
  @Column({ type: 'text', nullable: true })
  last_name: string;

  // * Dates
  @ApiProperty({
    example: null,
    description: 'Date when the customer has been updated',
  })
  @Expose({ groups: [ExposeGroupsEnum.me, ExposeGroupsEnum.admin] })
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
