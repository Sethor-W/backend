import {
  Controller,
  UseGuards,
  Body,
  Req,
  Query,
  Post,
  Get,
} from '@nestjs/common';
import { Request } from 'express';
import { OrderService } from '../services/orders.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ApiTags } from '@nestjs/swagger';
import { CreateOrderDTO } from '../dto/createOrder.dto';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/')
  create(
    @Body() data: CreateOrderDTO[],
    @Query('branchId') branchId: string,
    @Req() req: Request,
  ) {
    return this.orderService.create(req['user']['id'], branchId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  getOrdersByUser(@Req() req: Request) {
    return this.orderService.getOrderByUser(req['user']['id']);
  }
}
