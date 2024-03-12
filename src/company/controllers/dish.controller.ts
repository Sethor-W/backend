import { Body, Controller, Post, Query, UseGuards } from '@nestjs/common';
import { DishService } from '../services/dish.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ApiTags } from '@nestjs/swagger';
import { CreateDishDTO } from '../dto/createDish.dto';

@ApiTags('dish')
@Controller('dish')
export class DishController {
  constructor(private readonly dishService: DishService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  create(@Body() data: CreateDishDTO, @Query('branchId') branchId: string) {
    return this.dishService.create(data, branchId);
  }
}
