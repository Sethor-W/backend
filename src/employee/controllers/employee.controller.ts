import { Controller, Post, Body, Get, Put, Param } from '@nestjs/common';
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

  @Get('/list')
  getListEmplee(branchId: string) {
    return this.employeeService.getListEmployee(branchId);
  }

  @Put('/update/:id')
  updateInfo(@Param('id') id: string, @Body() data: CreateEmployeeDTO) {
    return this.employeeService.updateInfoEmployee(id, data);
  }
}
