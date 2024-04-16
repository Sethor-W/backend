import { IsString, IsNumber, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderData {
  @IsNumber()
  amounr: number;

  @IsString()
  dish: string;
}

export class CreateOrderDTO {
  @ApiProperty({
    example: {
      amount: 3.99,
      dish: 'asdjjfsfs7a897f87',
    },
  })
  @IsArray()
  order_data: OrderData[];
}
