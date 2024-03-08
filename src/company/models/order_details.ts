import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Branch } from './branch.model';
import { User } from 'src/user/models/user.model';

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
}
