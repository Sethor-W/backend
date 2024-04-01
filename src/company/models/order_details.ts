import {
  Entity,
  Column,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Dish } from './dish.model';
import { Order } from './order';

@Entity()
export class OrderDetails {
  @PrimaryColumn()
  id: string;

  @Column()
  amount: number;

  @OneToOne(() => Dish, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn()
  dish: string;

  @ManyToOne(() => Order, (order) => order.id, { onDelete: 'CASCADE' })
  order: Order;
}
