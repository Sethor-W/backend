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
import { JwtBusinessAuthGuard } from 'src/auth/guards/jwt.business.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { Role } from 'src/auth/enums/roles.enums';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('/')
  @Roles(Role.Worker)
  @UseGuards(JwtBusinessAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiResponse(orderResponses.createSuccess)
  @ApiResponse(orderResponses.createBadRequest)
  create(
    @Body() data: CreateOrderDTO,
    @Query('branchId') branchId: string,
    @Query('userId') userId: string,
    @Req() req: Request,
  ) {
    return this.orderService.create(req['user']['id'], userId, branchId, data);
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
