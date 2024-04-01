import { Repository } from 'typeorm';
import { Employee } from '../models/employee.model';

export class EmployeeRepository extends Repository<Employee> {}
