import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Expose } from 'class-transformer';
import { EntityHelper } from 'src/utils/entities/entity-helper.entity';
import { Book } from '../../entities/book.entity';
import { ExposeGroupsEnum } from 'src/utils/types/expose-groups.enum';

@Entity('Location')
export class Location extends EntityHelper {
  @ApiProperty({ example: 1, description: 'The id of the location' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Storage', description: 'The location' })
  @Expose({ groups: [ExposeGroupsEnum.me, ExposeGroupsEnum.admin] })
  @Column({ type: 'text', nullable: false, unique: true })
  location: string;

  // * Relations
  @OneToMany(() => Book, (book) => book.location)
  books: Book[];
}
