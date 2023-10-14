import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class Task extends BaseEntity  {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: process.env.NODE_ENV == 'test' ? 'datetime' : 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  creationDate: Date;

  @Column({ type: process.env.NODE_ENV == 'test' ? 'datetime' : 'timestamp' })
  dueDate: Date;

  @Column()
  assignedTo: string;

  @Column()
  category: string;

  @Column()
  status: string; // You might want to use an enum for status.
}