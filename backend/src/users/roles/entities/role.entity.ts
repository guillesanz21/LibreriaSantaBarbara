import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { EntityHelper } from 'src/utils/entities/entity-helper.entity';
import { User } from '../../entities/user.entity';

@Entity('Role')
export class Role extends EntityHelper {
  @ApiProperty({ example: 1, description: 'The id of the role' })
  @PrimaryColumn()
  id: number;

  @ApiProperty({ example: 'Admin', description: 'The role of the user' })
  @Column({ type: 'text', nullable: false, unique: true })
  role: string;

  // * Relations
  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
