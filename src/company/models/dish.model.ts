import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Branch } from './branch.model';

@Entity()
export class Dish {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @ManyToOne(() => Branch, (branch) => branch.id)
  branch: Branch;
}
