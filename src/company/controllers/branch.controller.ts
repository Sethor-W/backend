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
import { branchResponses } from 'src/responses/branch.responses';

@ApiTags('branch')
@Controller('branch')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse(branchResponses.createSuccess)
  @ApiResponse(branchResponses.createError)
  create(
    @Body() data: CreateBranchDTO,
    @Query() Id: { Id: string },
    @Req() req: Request,
  ) {
    return this.branchService.create(data, Id, req['user']['id']);
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse(branchResponses.getBranchesSuccess)
  @ApiResponse(branchResponses.getBranchesError)
  getBranchs(@Query() companyId: { Id: string }, @Req() req: Request) {
    return this.branchService.getBranch(companyId, req['user']['id']);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse(branchResponses.getBranchByIdSuccess)
  @ApiResponse(branchResponses.getBranchByIdError)
  getBranchById(
    @Param('id') id: string,
    @Query() companyId: { Id: string },
    @Req() req: Request,
  ) {
    return this.branchService.getBranchById(id, companyId, req['user']['id']);
  }

  @Put('/update/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse(branchResponses.updateBranchSuccess)
  @ApiResponse(branchResponses.updateBranchErrorBadRequest)
  @ApiResponse(branchResponses.updateBranchError)
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

  @Delete('/delete/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse(branchResponses.deleteBranchSuccess)
  @ApiResponse(branchResponses.deleteBranchErrorBadRequest)
  @ApiResponse(branchResponses.deleteBranchError)
  deleteBranch(
    @Param('id') id: string,
    @Query() companyId: { Id: string },
    @Req() req: Request,
  ) {
    return this.branchService.deleteBranch(id, companyId, req['user']['id']);
  }

  @Get('/all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse(branchResponses.getAllBranchSuccess)
  getAllBranch() {
    return this.branchService.getAllBranch();
  }
}
