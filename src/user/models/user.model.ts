import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column()
  rut: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  phone: string;
}
