import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm';
import { User } from '../../user/models/user.model';

@Entity()
export class Claim {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;
}
