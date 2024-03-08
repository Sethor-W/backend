import { User } from 'src/user/models/user.model';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  titularName: string;

  @Column()
  number: number;

  @Column()
  cvv: number;

  @Column()
  expirationDate: Date;

  @ManyToOne(() => User, (user) => user.id)
  user: User;
}
