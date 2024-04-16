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

@ApiTags('dish')
@Controller('dish')
export class DishController {
  constructor(private readonly dishService: DishService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    schema: {
      example: {
        ok: true,
        data: {
          id: 'gd7d88dfgd34gd2db',
          name: 'pasta a la carbonara',
          description: 'pasta al a carbonara',
          price: 3.99,
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    schema: {
      example: {
        ok: false,
        message: 'branch not found',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'bad request' })
  @Post('/create')
  create(@Body() data: CreateDishDTO, @Query('branchId') branchId: string) {
    return this.dishService.create(data, branchId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        id: 'gd7d88dfgd34gd2db',
        name: 'pasta a la carbonara',
        description: 'pasta al a carbonara',
        price: 3.99,
      },
    },
  })
  @ApiResponse({
    status: 404,
    schema: {
      example: {
        ok: false,
        message: 'branch not found',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'bad request' })
  @Get('/')
  getDishes(@Query('branchId') branchId: string) {
    return this.dishService.getDishes(branchId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        id: 'gd7d88dfgd34gd2db',
        name: 'pasta a la carbonara',
        description: 'pasta al a carbonara',
        price: 3.99,
      },
    },
  })
  @ApiResponse({
    status: 404,
    schema: {
      example: {
        ok: false,
        message: 'dish not found',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'bad request' })
  @Get('/:id')
  getOneDish(@Param('id') id: string) {
    return this.dishService.getOneDish(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        ok: true,
        message: 'Dish updated',
      },
    },
  })
  @ApiResponse({
    status: 404,
    schema: {
      example: {
        ok: false,
        message: 'branch not found',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'bad request' })
  @Put('/update')
  update(
    @Query('id') id: string,
    @Body() data: CreateDishDTO,
    @Query('branchId') branchId: string,
  ) {
    return this.dishService.update(id, branchId, data);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        ok: true,
        message: 'dish deleted',
      },
    },
  })
  @ApiResponse({
    status: 404,
    schema: {
      example: {
        ok: false,
        message: 'branch not found',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'bad request' })
  @Delete('/delete')
  delete(@Query('id') id: string, @Query('branchId') branchId: string) {
    return this.dishService.delete(id, branchId);
  }
}
