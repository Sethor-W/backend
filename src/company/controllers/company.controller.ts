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

@ApiTags('company')
@Controller('company')
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 201,
    schema: {
      example: {
        id: 'fuf77d9d8h3hj88',
        name: 'company name',
        phone: '900 23232233',
        description: 'product manufacturing company',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'error when registering company' })
  @Post('/register')
  register(@Body() data: CreateCompanyDTO, @Req() req: Request) {
    return this.companyService.register(data, req['user']['id']);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        result: ['Companies...'],
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Get('/')
  getCompanies(@Req() req: Request) {
    return this.companyService.getCompany(req['user']['id']);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        ok: true,
        message: 'Company delete',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'company not found' })
  @Delete('/delete/:id')
  delete(@Param('id') id: string, @Req() req: Request) {
    return this.companyService.delete(id, req['user']['id']);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        ok: true,
        message: 'company info updated',
      },
    },
  })
  @ApiResponse({
    status: 404,
    schema: {
      example: {
        ok: true,
        message: 'company not found',
      },
    },
  })
  @Put('/update/:id')
  update(
    @Param('id') id: string,
    @Body() data: CreateCompanyDTO,
    @Req() req: Request,
  ) {
    return this.companyService.update(data, id, req['user']['id']);
  }
}
