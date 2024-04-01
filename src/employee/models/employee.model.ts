import { Entity, Column, PrimaryColumn } from 'typeorm';
import { EmployeeType } from '../enum/employee.enum';

@Entity()
export class Employee {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  rut: string;

  @Column()
  type: EmployeeType;

  @Column({ nullable: true })
  ep: string;
}
