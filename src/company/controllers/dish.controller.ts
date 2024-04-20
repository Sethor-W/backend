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
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateDishDTO } from '../dto/createDish.dto';
import { dishResponses } from 'src/responses/dish.responses';

@ApiTags('dish')
@Controller('dish')
export class DishController {
  constructor(private readonly dishService: DishService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse(dishResponses.createSuccess)
  @ApiResponse(dishResponses.createBranchNotFound)
  @ApiResponse(dishResponses.createBadRequest)
  create(@Body() data: CreateDishDTO, @Query('branchId') branchId: string) {
    return this.dishService.create(data, branchId);
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse(dishResponses.getDishesSuccess)
  @ApiResponse(dishResponses.getBranchNotFound)
  @ApiResponse(dishResponses.getBadRequest)
  getDishes(@Query('branchId') branchId: string) {
    return this.dishService.getDishes(branchId);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse(dishResponses.getDishesSuccess)
  @ApiResponse(dishResponses.getDishNotFound)
  @ApiResponse(dishResponses.getBadRequest)
  getOneDish(@Param('id') id: string) {
    return this.dishService.getOneDish(id);
  }

  @Put('/update')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse(dishResponses.updateSuccess)
  @ApiResponse(dishResponses.updateBranchNotFound)
  @ApiResponse(dishResponses.updateBadRequest)
  update(
    @Query('id') id: string,
    @Body() data: CreateDishDTO,
    @Query('branchId') branchId: string,
  ) {
    return this.dishService.update(id, branchId, data);
  }

  @Delete('/delete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse(dishResponses.deleteSuccess)
  @ApiResponse(dishResponses.deleteBranchNotFound)
  @ApiResponse(dishResponses.deleteBadRequest)
  delete(@Query('id') id: string, @Query('branchId') branchId: string) {
    return this.dishService.delete(id, branchId);
  }
}
