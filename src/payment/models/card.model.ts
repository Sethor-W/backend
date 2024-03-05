import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}
