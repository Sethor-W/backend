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
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { EmployeeService } from '../services/employee.service';
import { CreateEmployeeDTO } from '../dto/createEmployee.dto';
import { CreateEmployeeWorkerDTO } from '../dto/createEmployeeWorker.dto';
import { JwtManagerAuthGuard } from 'src/auth/guards/jwt.manager.guard';
import { employeeResponses } from 'src/responses/employee.responses';

@ApiTags('employee')
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post('new')
  @UseGuards(JwtBusinessAuthGuard)
  @ApiBearerAuth()
  @ApiResponse(employeeResponses.createEmployeeSuccess)
  @ApiResponse(employeeResponses.createEmployeeConflict)
  @ApiResponse(employeeResponses.createEmployeeBadRequest)
  createEmployee(@Body() data: CreateEmployeeDTO) {
    return this.employeeService.createEmployee(data);
  }

  @Post('/new-worker')
  @UseGuards(JwtManagerAuthGuard)
  @ApiBearerAuth()
  @ApiResponse(employeeResponses.createWorkerSuccess)
  @ApiResponse(employeeResponses.createWorkerConflict)
  @ApiResponse(employeeResponses.createWorkerBadRequest)
  createWorker(@Body() data: CreateEmployeeWorkerDTO) {
    return this.employeeService.createEmployeeWorker(data);
  }

  @Get('/list')
  @UseGuards(JwtBusinessAuthGuard, JwtManagerAuthGuard)
  @ApiBearerAuth()
  @ApiResponse(employeeResponses.listEmployeeSuccess)
  @ApiResponse(employeeResponses.listEmployeeBadRequest)
  getListEmployee(branchId: string) {
    return this.employeeService.getListEmployee(branchId);
  }

  @Put('/update/:id')
  @UseGuards(JwtBusinessAuthGuard, JwtManagerAuthGuard)
  @ApiBearerAuth()
  @ApiResponse(employeeResponses.updateEmployeeSuccess)
  @ApiResponse(employeeResponses.updateEmployeeBadRequest)
  updateInfo(@Param('id') id: string, @Body() data: CreateEmployeeDTO) {
    return this.employeeService.updateInfoEmployee(id, data);
  }
}
