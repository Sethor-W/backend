import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBranchDTO {
  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  opening_days: string;

  @ApiProperty()
  @IsString()
  opening_time: string;

  @ApiProperty()
  @IsString()
  closing_time: string;
}
