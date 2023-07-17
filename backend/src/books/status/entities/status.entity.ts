import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { EntityHelper } from 'src/utils/entities/entity-helper.entity';
import { Book } from '../../books/entities/book.entity';

@Entity('Status')
export class Status extends EntityHelper {
  @ApiProperty({ example: 1, description: 'The id of the status' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Sold', description: 'The status' })
  @Column({ type: 'text', nullable: false, unique: true })
  status: string;

  // * Relations
  @OneToMany(() => Book, (book) => book.status)
  books: Book[];
}
