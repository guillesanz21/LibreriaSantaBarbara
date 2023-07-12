import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { EntityHelper } from 'src/utils/entities/entity-helper.entity';
import { Book } from '../../entities/book.entity';

@Entity('Topic')
export class Topic extends EntityHelper {
  @ApiProperty({ example: 1, description: 'The id of the topic' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'History', description: 'The topic' })
  @Column({ type: 'text', nullable: false, unique: true })
  topic: string;

  // * Relations
  @ManyToMany(() => Book, (book) => book.topics, {
    eager: false,
    onUpdate: 'CASCADE',
  })
  books: Book[];
}
