import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeService } from './services/employee.service';
import { EmployeeController } from './controllers/employee.controller';
import { Employee } from './models/employee.model';
import { Functions } from './models/functions.model';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Functions])],
  providers: [EmployeeService],
  controllers: [EmployeeController],
  exports: [EmployeeService],
})
export class EmployeeModule {}
