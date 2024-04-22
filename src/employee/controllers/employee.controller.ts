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
import { employeeResponses } from 'src/responses/employee.responses';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { Role } from 'src/auth/enums/roles.enums';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('employee')
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post('new')
  @Roles(Role.Owner)
  @UseGuards(JwtBusinessAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiResponse(employeeResponses.createEmployeeSuccess)
  @ApiResponse(employeeResponses.createEmployeeConflict)
  @ApiResponse(employeeResponses.createEmployeeBadRequest)
  createEmployee(@Body() data: CreateEmployeeDTO) {
    return this.employeeService.createEmployee(data);
  }

  @Post('/new-worker')
  @Roles(Role.Manager)
  @UseGuards(JwtBusinessAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiResponse(employeeResponses.createWorkerSuccess)
  @ApiResponse(employeeResponses.createWorkerConflict)
  @ApiResponse(employeeResponses.createWorkerBadRequest)
  createWorker(@Body() data: CreateEmployeeWorkerDTO) {
    return this.employeeService.createEmployeeWorker(data);
  }

  @Get('/list')
  @Roles(Role.Owner, Role.Manager)
  @UseGuards(JwtBusinessAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiResponse(employeeResponses.listEmployeeSuccess)
  @ApiResponse(employeeResponses.listEmployeeBadRequest)
  getListEmployee(branchId: string) {
    return this.employeeService.getListEmployee(branchId);
  }

  @Put('/update/:id')
  @Roles(Role.Owner, Role.Manager)
  @UseGuards(JwtBusinessAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiResponse(employeeResponses.updateEmployeeSuccess)
  @ApiResponse(employeeResponses.updateEmployeeBadRequest)
  updateInfo(@Param('id') id: string, @Body() data: CreateEmployeeDTO) {
    return this.employeeService.updateInfoEmployee(id, data);
  }
}
