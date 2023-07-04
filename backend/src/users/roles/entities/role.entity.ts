import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { EntityHelper } from 'src/utils/entities/entity-helper.entity';
import { User } from '../../entities/user.entity';

@Entity('Role')
export class Role extends EntityHelper {
  @PrimaryColumn()
  id: number;

  @Column({ type: 'text', nullable: false, unique: true })
  role: string;

  // * Relations
  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
