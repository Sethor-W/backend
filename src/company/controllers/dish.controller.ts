import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Query,
  UseGuards,
  Put,
  Delete,
} from '@nestjs/common';
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

  @UseGuards(JwtAuthGuard)
  @Get('/')
  getDishes(@Query('branchId') branchId: string) {
    return this.dishService.getDishes(branchId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  getOneDish(@Param('id') id: string) {
    return this.dishService.getOneDish(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/update')
  update(
    @Query('id') id: string,
    @Body() data: CreateDishDTO,
    @Query('branchId') branchId: string,
  ) {
    return this.dishService.update(id, branchId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delete')
  delete(@Query('id') id: string, @Query('branchId') branchId: string) {
    return this.dishService.delete(id, branchId);
  }
}
