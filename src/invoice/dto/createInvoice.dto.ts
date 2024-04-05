import { IsString, IsNumber } from 'class-validator';

export class CreateInvoiceDTO {
  @IsString()
  businessName: string;

  @IsString()
  businessType: string;

  @IsString()
  branchAdress: string;

  @IsString()
  typeBiometric: string;

  @IsString()
  card: string;

  @IsString()
  suplier: string;

  @IsString()
  cardHolder: string;

  @IsNumber()
  subTotal: number;

  @IsNumber()
  iva: number;

  @IsNumber()
  sth: number;

  @IsNumber()
  total: number;
}
