import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm';
import { User } from 'src/user/models/user.model';

@Entity()
export class Company {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  opening_days: string;

  @Column()
  opening_time: string;

  @Column()
  closing_time: string;

  @Column()
  description: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;
}
