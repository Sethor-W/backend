import { IsString } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  name: string;

  @IsString()
  lastName: string;

  @IsString()
  rut: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  phone: string;
}
