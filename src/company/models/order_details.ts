import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Branch } from './branch.model';
import { User } from 'src/user/models/user.model';
import { Dish } from './dish.model';

@Entity()
export class OrderDetails {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  order_time: Date;

  @ManyToOne(() => Branch, (branch) => branch.id)
  branch: Branch;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToMany(() => Dish)
  @JoinTable()
  dish: Dish[];
}
