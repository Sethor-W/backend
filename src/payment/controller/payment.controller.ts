import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  UseGuards,
  Delete,
  Param,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { PaymentService } from '../services/payment.service';
import { RegisterCardDTO } from '../dto/registerCar.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/card')
  register(@Body() data: RegisterCardDTO, @Req() req: Request) {
    return this.paymentService.registerCard(data, req['user']['id']);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/card')
  getCardsInfo() {
    return this.paymentService.getCardsInfo();
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:id')
  delete(@Param('id') id: string) {
    return this.paymentService.delete(id);
  }
}
