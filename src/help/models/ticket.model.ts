import { User } from 'src/user/models/user.model';
import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm';

@Entity()
export class Ticket {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;
}
