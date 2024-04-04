import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentDTO {
  @ApiProperty()
  @IsString()
  rutFrontalPhoto: string;

  @ApiProperty()
  @IsString()
  rutDorsalPhoto: string;

  @ApiProperty()
  @IsString()
  selfie: string;
}
