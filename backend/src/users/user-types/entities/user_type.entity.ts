import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { EntityHelper } from 'src/utils/entities/entity-helper.entity';
import { User } from '../../entities/user.entity';

@Entity('User_Type')
export class User_Type extends EntityHelper {
  @PrimaryColumn()
  id: number;

  @Column({ type: 'text', nullable: false, unique: true })
  user_type: string;

  // * Relations
  @OneToMany(() => User, (user) => user.user_type)
  users: User[];
}
