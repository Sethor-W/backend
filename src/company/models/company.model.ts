import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
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
  descrition: string;
}
