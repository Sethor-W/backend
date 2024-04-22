import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtBusinessAuthGuard } from 'src/auth/guards/jwt.business.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserBusinessService } from '../services/userBusiness.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { Role } from 'src/auth/enums/roles.enums';
import { Request } from 'express';
import { userBusinessResponse } from 'src/responses/userBusiness.response';

@ApiTags('business')
@Controller('business')
export class UserBusinessController {
  constructor(private readonly userBusService: UserBusinessService) {}

  @UseGuards(JwtBusinessAuthGuard, RolesGuard)
  @Roles(Role.Owner, Role.Manager)
  @ApiBearerAuth()
  @ApiResponse(userBusinessResponse.generateEP)
  @Get('generate-ep')
  async generateEP() {
    return await this.userBusService.generateEP();
  }

  @UseGuards(JwtBusinessAuthGuard, RolesGuard)
  @Roles(Role.Owner)
  @ApiBearerAuth()
  @ApiResponse(userBusinessResponse.getUserByIdSuccess)
  @ApiResponse(userBusinessResponse.getUserByIdError)
  @Get('/')
  getUserById(@Req() req: Request) {
    return this.userBusService.getUserById(req['user']['id']);
  }
}
