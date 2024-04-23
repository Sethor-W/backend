import {
  Controller,
  UseGuards,
  Post,
  Req,
  Body,
  Get,
  Delete,
  Param,
  Put,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CompanyService } from '../services/company.service';
import { CreateCompanyDTO } from '../dto/createCompany.dto';
import { companyResponses } from 'src/responses/company.responses';
import { JwtBusinessAuthGuard } from 'src/auth/guards/jwt.business.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { Role } from 'src/auth/enums/roles.enums';

@ApiTags('company')
@Controller('company')
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @Post('/register')
  @Roles(Role.Owner)
  @UseGuards(JwtBusinessAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiResponse(companyResponses.registerSuccess)
  @ApiResponse(companyResponses.registerError)
  register(@Body() data: CreateCompanyDTO, @Req() req: Request) {
    return this.companyService.register(data, req['user']['id']);
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse(companyResponses.getCompaniesSuccess)
  @ApiResponse(companyResponses.getCompaniesError)
  getCompanies(@Req() req: Request) {
    return this.companyService.getCompany(req['user']['id']);
  }

  @Delete('/delete/:id')
  @Roles(Role.Owner)
  @UseGuards(JwtBusinessAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiResponse(companyResponses.deleteCompanySuccess)
  @ApiResponse(companyResponses.deleteCompanyError)
  delete(@Param('id') id: string, @Req() req: Request) {
    return this.companyService.delete(id, req['user']['id']);
  }

  @Put('/update/:id')
  @Roles(Role.Owner)
  @UseGuards(JwtBusinessAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiResponse(companyResponses.updateCompanySuccess)
  @ApiResponse(companyResponses.updateCompanyError)
  update(
    @Param('id') id: string,
    @Body() data: CreateCompanyDTO,
    @Req() req: Request,
  ) {
    return this.companyService.update(data, id, req['user']['id']);
  }
}
