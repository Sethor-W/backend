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

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    schema: {
      example: {
        ok: true,
        message: 'order check',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'bad request' })
  @Post('/')
  create(
    @Body() data: CreateOrderDTO,
    @Query('branchId') branchId: string,
    @Req() req: Request,
  ) {
    return this.orderService.create(req['user']['id'], branchId, data);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        ok: true,
        data: [
          {
            id: 'g8jfj57ds9j598dfj4',
            amount: 3.99,
            dish: 'pasta a la carbonara',
          },
          {},
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    schema: {
      example: {
        ok: false,
        message: 'the user has no orders',
      },
    },
  })
  @Get('/')
  getOrdersByUser(@Req() req: Request) {
    return this.orderService.getOrderByUser(req['user']['id']);
  }
}
