import { Controller, UseGuards, Req, Post, Body } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';
import { HelpService } from '../services/help.service';
import { HelpDTO } from '../dto/help.dto';

@ApiTags('help')
@Controller('help')
export class HelpController {
  constructor(private helpService: HelpService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    schema: {
      example: {
        id: 'ff8s8gsdgs8787s9g7',
        title: 'Mal servicio',
        content: 'Mal servicio por parte de mesero',
        user: 'user',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'bad request' })
  @Post('/claim')
  createClaim(@Body() data: HelpDTO, @Req() req: Request) {
    return this.helpService.createClaim(req['user']['id'], data);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    schema: {
      example: {
        id: 'ff8s8gsdgs8787s9g7',
        title: 'Mal servicio',
        content: 'Mal servicio por parte de mesero',
        user: 'user',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'bad request' })
  @Post('/suggestion')
  createSuggestion(@Body() data: HelpDTO, @Req() req: Request) {
    return this.helpService.createSuggestion(req['user']['id'], data);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    schema: {
      example: {
        id: 'ff8s8gsdgs8787s9g7',
        title: 'Mal servicio',
        content: 'Mal servicio por parte de mesero',
        user: 'user',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'bad request' })
  @Post('/ticket')
  createTicket(@Body() data: HelpDTO, @Req() req: Request) {
    return this.helpService.createTicket(req['user']['id'], data);
  }
}
