import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EmployeeService } from '../services/employee.service';
import { CreateEmployeeDTO } from '../dto/createEmployee.dto';

@ApiTags('employee')
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post('new')
  createEmployee(@Body() data: CreateEmployeeDTO) {
    return this.employeeService.createEmployee(data);
  }
}
