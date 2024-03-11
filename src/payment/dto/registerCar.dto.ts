import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterCardDTO {
  @ApiProperty()
  @IsString()
  titularName: string;

  @ApiProperty()
  @IsNumber()
  number: string;

  @ApiProperty()
  @IsNumber()
  cvv: string;

  @ApiProperty()
  @IsString()
  expirationDate: string;
}
