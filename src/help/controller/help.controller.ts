import { Controller, UseGuards, Req, Post, Body } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';
import { HelpService } from '../services/help.service';
import { HelpDTO } from '../dto/help.dto';
import { helpResponses } from 'src/responses/help.responses';

@ApiTags('help')
@Controller('help')
export class HelpController {
  constructor(private helpService: HelpService) {}

  @Post('/claim')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse(helpResponses.createClaimSuccess)
  @ApiResponse(helpResponses.createBadRequest)
  createClaim(@Body() data: HelpDTO, @Req() req: Request) {
    return this.helpService.createClaim(req['user']['id'], data);
  }

  @Post('/suggestion')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse(helpResponses.createSuggestionSuccess)
  @ApiResponse(helpResponses.createBadRequest)
  createSuggestion(@Body() data: HelpDTO, @Req() req: Request) {
    return this.helpService.createSuggestion(req['user']['id'], data);
  }

  @Post('/ticket')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse(helpResponses.createTicketSuccess)
  @ApiResponse(helpResponses.createBadRequest)
  createTicket(@Body() data: HelpDTO, @Req() req: Request) {
    return this.helpService.createTicket(req['user']['id'], data);
  }
}
