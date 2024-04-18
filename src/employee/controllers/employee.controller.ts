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

@ApiTags('employee')
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @UseGuards(JwtBusinessAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    schema: {
      example: {
        name: 'juab',
        lastName: 'lopez',
        email: 'juan@gmail.com',
        phone: '59903453553',
        rut: 'c343434f34f434',
        key_word: 'cafecito',
        credential: 'c343434f34f434.cafecito',
        type: 'manager/worker',
        ep: 'manager/worker',
      },
    },
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        ok: false,
        message: 'the employee already exists',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'bad request' })
  @Post('new')
  createEmployee(@Body() data: CreateEmployeeDTO) {
    return this.employeeService.createEmployee(data);
  }

  @UseGuards(JwtManagerAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    schema: {
      example: {
        name: 'juab',
        lastName: 'lopez',
        email: 'juan@gmail.com',
        phone: '59903453553',
        rut: 'c343434f34f434',
        key_word: 'cafecito',
        credential: 'c343434f34f434.cafecito',
        type: 'worker',
        ep: 'worker',
      },
    },
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        ok: false,
        message: 'the employee already exists',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'bad request' })
  @Post('/new-worker')
  createWorker(@Body() data: CreateEmployeeWorkerDTO) {
    return this.employeeService.createEmployeeWorker(data);
  }

  @UseGuards(JwtBusinessAuthGuard, JwtManagerAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        name: 'juab',
        lastName: 'lopez',
        email: 'juan@gmail.com',
        phone: '59903453553',
        rut: 'c343434f34f434',
        key_word: 'cafecito',
        credential: 'c343434f34f434.cafecito',
        type: 'manager/worker',
        ep: 'manager/worker',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'bad request' })
  @Get('/list')
  getListEmployee(branchId: string) {
    return this.employeeService.getListEmployee(branchId);
  }

  @UseGuards(JwtBusinessAuthGuard, JwtManagerAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        ok: true,
        message: 'Updated employee information: gjd73j3jnsd84yhds73',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'bad request' })
  @Put('/update/:id')
  updateInfo(@Param('id') id: string, @Body() data: CreateEmployeeDTO) {
    return this.employeeService.updateInfoEmployee(id, data);
  }
}
