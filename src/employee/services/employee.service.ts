import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeRepository } from '../repository/employee.repository';
import { Employee } from '../models/employee.model';
import { CreateEmployeeDTO } from '../dto/createEmployee.dto';
import { CreateEmployeeWorkerDTO } from '../dto/createEmployeeWorker.dto';
import { FunctionsRepository } from '../repository/functions.repository';
import { Functions } from '../models/functions.model';
import { v4 as uuidv4 } from 'uuid';
import { FunctionEnum } from '../enum/functions.enum';
import { EmployeeType } from '../enum/employee.enum';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee) private employeeRepo: EmployeeRepository,
    @InjectRepository(Functions) private functionRepo: FunctionsRepository,
  ) {}

  //creation new employee
  async createEmployee(data: CreateEmployeeDTO) {
    try {
      //check if the employee already exists
      const employee = await this.employeeRepo.findOneBy({ email: data.email });
      if (employee) {
        return {
          ok: false,
          message: 'the employee already exists',
        };
      }
      const newEmployee = this.employeeRepo.create({
        id: uuidv4(),
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
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
        type: EmployeeType.Worker,
        ep: data.ep,
        branch: data.branchId,
      });
      await this.employeeRepo.save(newEmployee);
      return newEmployee;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  //delegate functions to manager
  async delegateFunction(employeeId: string, func_name: FunctionEnum) {
    try {
      const employee = await this.employeeRepo.findOneBy({
        id: employeeId,
        type: EmployeeType.Manager,
      });
      if (!employee) {
        return {
          ok: false,
          message: 'employee not found',
        };
      }
      const func = this.functionRepo.create({
        id: uuidv4(),
        func_name,
        employee,
      });
      await this.functionRepo.save(func);
      return func;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getEmployeeById(id: string) {
    try {
      const employee = await this.employeeRepo.findOneBy({ id });
      return employee;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getEmployeeEmailCredential(email: string, credential: string) {
    try {
      const employee = await this.employeeRepo.findOneBy({ email, credential });
      return employee;
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
