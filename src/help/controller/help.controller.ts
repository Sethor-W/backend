import { Controller, UseGuards, Req, Post, Body } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ApiTags } from '@nestjs/swagger';
import { HelpService } from '../services/help.service';
import { HelpDTO } from '../dto/help.dto';

@ApiTags('help')
@Controller('help')
export class HelpController {
  constructor(private helpService: HelpService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/claim')
  createClaim(@Body() data: HelpDTO, @Req() req: Request) {
    return this.helpService.createClaim(req['user']['id'], data);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/suggestion')
  createSuggestion(@Body() data: HelpDTO, @Req() req: Request) {
    return this.helpService.createSuggestion(req['user']['id'], data);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/ticket')
  createTicket(@Body() data: HelpDTO, @Req() req: Request) {
    return this.helpService.createTicket(req['user']['id'], data);
  }
}
