import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDTO {
  @ApiProperty()
  @IsString()
  name: string;

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

  @ApiProperty()
  @IsString()
  description: string;
}
