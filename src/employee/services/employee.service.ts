import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeRepository } from '../repository/employee.repository';
import { Employee } from '../models/employee.model';
import { CreateEmployeeDTO } from '../dto/createEmployee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee) private employeeRepo: EmployeeRepository,
  ) {}

  //creation new employee
  async createEmployee(data: CreateEmployeeDTO) {
    try {
      //check if the employee already exists
      const employee = await this.employeeRepo.findOneBy({ email: data.email });
      if (!employee) {
        return {
          ok: false,
          message: 'the employee already exists',
        };
      }
      const newEmployee = this.employeeRepo.create({
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        rut: data.rut,
        type: data.type,
        ep: data.ep,
        branch: data.branchId,
      });
      await this.employeeRepo.save(newEmployee);
      return newEmployee;
    } catch (error) {}
  }
}
