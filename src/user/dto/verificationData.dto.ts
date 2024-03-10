import { IsString, IsNumber } from 'class-validator';

export class VerificationDataDTO {
  @IsNumber()
  code: number;

  @IsString()
  rutFrontalPhoto: string;

  @IsString()
  rutDorsalPhoto: string;

  @IsString()
  selfie: string;
}
