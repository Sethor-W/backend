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
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CreateOrderDTO } from '../dto/createOrder.dto';
import { orderResponses } from 'src/responses/order.responses';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse(orderResponses.createSuccess)
  @ApiResponse(orderResponses.createBadRequest)
  create(
    @Body() data: CreateOrderDTO,
    @Query('branchId') branchId: string,
    @Req() req: Request,
  ) {
    return this.orderService.create(req['user']['id'], branchId, data);
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse(orderResponses.getOrdersSuccess)
  @ApiResponse(orderResponses.getOrdersNotFound)
  getOrdersByUser(@Req() req: Request) {
    return this.orderService.getOrderByUser(req['user']['id']);
  }
}
