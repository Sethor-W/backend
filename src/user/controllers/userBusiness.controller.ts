import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserBusinessService } from '../services/userBusiness.service';

@ApiTags('business')
@Controller('business')
export class UserBusinessController {
  constructor(private readonly userBusService: UserBusinessService) {}

  @Get('generate-ep')
  async generateEP() {
    return await this.userBusService.generateEP();
  }
}
