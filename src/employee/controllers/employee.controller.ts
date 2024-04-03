import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtBusinessAuthGuard } from 'src/auth/guards/jwt.business.guard';
import { ApiTags } from '@nestjs/swagger';
import { EmployeeService } from '../services/employee.service';
import { CreateEmployeeDTO } from '../dto/createEmployee.dto';
import { CreateEmployeeWorkerDTO } from '../dto/createEmployeeWorker.dto';
import { JwtManagerAuthGuard } from 'src/auth/guards/jwt.manager.guard';

@ApiTags('employee')
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @UseGuards(JwtBusinessAuthGuard)
  @Post('new')
  createEmployee(@Body() data: CreateEmployeeDTO) {
    return this.employeeService.createEmployee(data);
  }

  @UseGuards(JwtManagerAuthGuard)
  @Post('/new-worker')
  createWorker(@Body() data: CreateEmployeeWorkerDTO) {
    return this.employeeService.createEmployeeWorker(data);
  }

  @UseGuards(JwtBusinessAuthGuard, JwtManagerAuthGuard)
  @Get('/list')
  getListEmployee(branchId: string) {
    return this.employeeService.getListEmployee(branchId);
  }

  @Put('/update/:id')
  updateInfo(@Param('id') id: string, @Body() data: CreateEmployeeDTO) {
    return this.employeeService.updateInfoEmployee(id, data);
  }
}
