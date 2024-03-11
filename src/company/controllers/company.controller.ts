import {
  Controller,
  UseGuards,
  Post,
  Req,
  Body,
  Get,
  Delete,
  Param,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CompanyService } from '../services/company.service';
import { CreateCompanyDTO } from '../dto/createCompany.dto';

@Controller('company')
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/register')
  register(@Body() data: CreateCompanyDTO, @Req() req: Request) {
    return this.companyService.register(data, req['user']['id']);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  getCompanies(@Req() req: Request) {
    return this.companyService.getCompany(req['user']['id']);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:id')
  delete(@Param('id') id: string, @Req() req: Request) {
    return this.companyService.delete(id, req['user']['id']);
  }
}
