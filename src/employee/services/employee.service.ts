import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeRepository } from '../repository/employee.repository';
import { Employee } from '../models/employee.model';
import { CreateEmployeeDTO } from '../dto/createEmployee.dto';
import { CreateEmployeeWorkerDTO } from '../dto/createEmployeeWorker.dto';

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
        key_word: data.key_word,
        credential: `${data.rut}.${data.key_word}`,
        type: data.type,
        ep: data.ep,
        branch: data.branchId,
      });
      await this.employeeRepo.save(newEmployee);
      return newEmployee;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  //creation new employee worker (only manager)
  async createEmployeeWorker(data: CreateEmployeeWorkerDTO) {
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
        key_word: data.key_word,
        credential: `${data.rut}.${data.key_word}`,
        type: data.type,
        ep: 'worker',
        branch: data.branchId,
      });
      await this.employeeRepo.save(newEmployee);
      return newEmployee;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  //get list of employees
  async getListEmployee(branchId: string) {
    try {
      const employees = await this.employeeRepo.findBy({ branch: branchId });
      return employees;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  //update employees's info
  async updateInfoEmployee(id: string, data: CreateEmployeeDTO) {
    try {
      await this.employeeRepo.update({ id }, data);
      return {
        ok: true,
        message: `Updated employee information: ${id}`,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
