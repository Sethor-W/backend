import {
  Body,
  Controller,
  UseGuards,
  Post,
  Param,
  Query,
  Req,
  Get,
  Put,
  Delete,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BranchService } from '../services/branch.service';
import { CreateBranchDTO } from '../dto/createBranch.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('branch')
@Controller('branch')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    schema: {
      example: {
        id: 'fsfshgj88tr8r88r9',
        address: 'Av siempre viva',
        phone: '900 343434',
        opening_days: 'lunes a viernes',
        opening_time: '8:00 am',
        closing_time: '7:00 pm',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'bad request' })
  @Post('/create')
  create(
    @Body() data: CreateBranchDTO,
    @Query() Id: { Id: string },
    @Req() req: Request,
  ) {
    return this.branchService.create(data, Id, req['user']['id']);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        result: ['Branches...'],
      },
    },
  })
  @ApiResponse({ status: 404, description: 'not found' })
  @Get('/')
  getBranchs(@Query() companyId: { Id: string }, @Req() req: Request) {
    return this.branchService.getBranch(companyId, req['user']['id']);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        id: 'fsfshgj88tr8r88r9',
        address: 'Av siempre viva',
        phone: '900 343434',
        opening_days: 'lunes a viernes',
        opening_time: '8:00 am',
        closing_time: '7:00 pm',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'branch not found' })
  @Get('/:id')
  getBranchById(
    @Param('id') id: string,
    @Query() companyId: { Id: string },
    @Req() req: Request,
  ) {
    return this.branchService.getBranchById(id, companyId, req['user']['id']);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        ok: true,
        message: 'Update branch',
      },
    },
  })
  @ApiResponse({
    status: 404,
    schema: {
      example: {
        ok: false,
        message: 'company not found',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'bad request' })
  @Put('/update/:id')
  updateBranch(
    @Body() data: CreateBranchDTO,
    @Param('id') id: string,
    @Query() companyId: { Id: string },
    @Req() req: Request,
  ) {
    return this.branchService.updateBranch(
      data,
      id,
      companyId,
      req['user']['id'],
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        ok: true,
        message: 'Delete branch',
      },
    },
  })
  @ApiResponse({
    status: 404,
    schema: {
      example: {
        ok: false,
        message: 'company not found',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'bad request' })
  @Delete('/delete/:id')
  deleteBranch(
    @Param('id') id: string,
    @Query() companyId: { Id: string },
    @Req() req: Request,
  ) {
    return this.branchService.deleteBranch(id, companyId, req['user']['id']);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        result: ['Brances...'],
      },
    },
  })
  @Get('/all')
  getAllBranch() {
    return this.branchService.getAllBranch();
  }
}
