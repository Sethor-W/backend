import { Entity, PrimaryColumn, Column, ManyToOne } from 'typeorm';
import { Branch } from './branch.model';

@Entity()
export class Dish {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('double precision')
  price: number;

  @ManyToOne(() => Branch, (branch) => branch.id)
  branch: Branch;
}
