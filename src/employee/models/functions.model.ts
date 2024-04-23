import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm';
import { FunctionEnum } from '../enum/functions.enum';
import { Employee } from './employee.model';

@Entity()
export class Functions {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: true })
  func_name: FunctionEnum;

  @ManyToOne(() => Employee)
  employee: Employee;
}
