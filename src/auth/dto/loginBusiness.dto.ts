import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginBusinessDTO {
  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  credential: string;
}
