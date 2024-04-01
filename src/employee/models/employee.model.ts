import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { EmployeeType } from '../enum/employee.enum';
import { Branch } from 'src/company/models/branch.model';

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

  @OneToOne(() => Branch)
  @JoinColumn()
  branch: string;
}
