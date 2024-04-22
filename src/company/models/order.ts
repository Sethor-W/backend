import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Branch } from './branch.model';
import { User } from '../../user/models/user.model';
import { OrderDetails } from './order_details';
import { Employee } from 'src/employee/models/employee.model';

@Entity()
export class Order {
  @PrimaryColumn()
  id: string;

  @CreateDateColumn()
  order_time: Date;

  @ManyToOne(() => Branch, (branch) => branch.id, { onDelete: 'CASCADE' })
  branch: Branch;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Employee, (empl) => empl.id, { onDelete: 'CASCADE' })
  employee: Employee;

  @OneToMany(() => OrderDetails, (order) => order.id)
  order_detail: OrderDetails[];
}
