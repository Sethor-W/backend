import { User } from 'src/user/models/user.model';
import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm';

@Entity()
export class Card {
  @PrimaryColumn({ nullable: false })
  id: string;

  @Column({ nullable: false })
  titularName: string;

  @Column({ nullable: false })
  number: string;

  @Column({ nullable: false })
  cvv: string;

  @Column({ nullable: false })
  expirationDate: string;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  user: User;
}
