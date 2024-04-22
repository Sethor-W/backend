import { IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EmployeeType } from '../enum/employee.enum';

export class CreateEmployeeDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  rut: string;

  @ApiProperty()
  @IsString()
  key_word: string;

  @ApiProperty()
  @IsEnum(EmployeeType)
  type: EmployeeType;

  @ApiProperty()
  @IsString()
  ep?: string;

  @ApiProperty()
  @IsString()
  branchId: string;
}
