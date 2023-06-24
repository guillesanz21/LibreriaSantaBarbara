import { Column, Entity } from 'typeorm';
import { User } from '../../entities/user.entity';

@Entity('Customer')
export class Customer extends User {
  @Column({ type: 'text', nullable: true })
  password: string;

  @Column({ type: 'text', nullable: true })
  first_name: string;

  @Column({ type: 'text', nullable: true })
  last_name: string;

  @Column({ type: 'text', nullable: true, unique: true })
  DNI: string;

  @Column({ nullable: false, default: false })
  email_confirmed: boolean;
}
