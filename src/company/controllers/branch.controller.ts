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
import { ApiTags } from '@nestjs/swagger';
import { BranchService } from '../services/branch.service';
import { CreateBranchDTO } from '../dto/createBranch.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('branch')
@Controller('branch')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  create(
    @Body() data: CreateBranchDTO,
    @Query() Id: { Id: string },
    @Req() req: Request,
  ) {
    return this.branchService.create(data, Id, req['user']['id']);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  getBranchs(@Query() companyId: { Id: string }, @Req() req: Request) {
    return this.branchService.getBranch(companyId, req['user']['id']);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  getBranchById(
    @Param('id') id: string,
    @Query() companyId: { Id: string },
    @Req() req: Request,
  ) {
    return this.branchService.getBranchById(id, companyId, req['user']['id']);
  }

  @UseGuards(JwtAuthGuard)
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
  @Delete('/delete/:id')
  deleteBranch(
    @Param('id') id: string,
    @Query() companyId: { Id: string },
    @Req() req: Request,
  ) {
    return this.branchService.deleteBranch(id, companyId, req['user']['id']);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/all')
  getAllBranch() {
    return this.branchService.getAllBranch();
  }
}
