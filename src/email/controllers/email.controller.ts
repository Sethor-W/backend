import { Body, Controller, Get, Post } from '@nestjs/common';
import { EmailService } from '../services/email.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('email')
@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Post('')
  send(@Body('email') email: string) {
    return this.emailService.sendEmail(email);
  }

  @Get('/verify')
  verifyCode(@Body() data: { code: string; email: string }) {
    return this.emailService.verifyCode(data);
  }
}
