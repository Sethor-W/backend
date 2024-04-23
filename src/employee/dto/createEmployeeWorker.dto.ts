import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeWorkerDTO {
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
  phone: string;

  @ApiProperty()
  @IsString()
  rut: string;

  @ApiProperty()
  @IsString()
  key_word: string;

  @ApiProperty()
  @IsString()
  ep: string;

  @ApiProperty()
  @IsString()
  branchId: string;
}
