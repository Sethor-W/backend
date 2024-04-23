import { IsEnum } from 'class-validator';
import { FunctionEnum } from '../enum/functions.enum';
import { ApiProperty } from '@nestjs/swagger';

export class FunctionDelegateDTO {
  @ApiProperty()
  @IsEnum(FunctionEnum)
  func_name: FunctionEnum;
}
