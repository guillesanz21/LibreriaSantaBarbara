import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Expose } from 'class-transformer';
import { EntityHelper } from 'src/utils/entities/entity-helper.entity';
import { Book } from '../../entities/book.entity';
import { ExposeGroupsEnum } from 'src/utils/types/expose-groups.enum';

@Entity('Status')
export class Status extends EntityHelper {
  @ApiProperty({ example: 1, description: 'The id of the status' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Sold', description: 'The status' })
  @Expose({ groups: [ExposeGroupsEnum.me, ExposeGroupsEnum.admin] })
  @Column({ type: 'text', nullable: false, unique: true })
  status: string;

  // * Relations
  @OneToMany(() => Book, (book) => book.status)
  books: Book[];
}
