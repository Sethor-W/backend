import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class HelpDTO {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  content: string;
}
