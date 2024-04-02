import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtBusinessAuthGuard } from 'src/auth/guards/jwt.business.guard';
import { ApiTags } from '@nestjs/swagger';
import { UserBusinessService } from '../services/userBusiness.service';

@ApiTags('business')
@Controller('business')
export class UserBusinessController {
  constructor(private readonly userBusService: UserBusinessService) {}

  @UseGuards(JwtBusinessAuthGuard)
  @Get('generate-ep')
  async generateEP() {
    return await this.userBusService.generateEP();
  }
}
