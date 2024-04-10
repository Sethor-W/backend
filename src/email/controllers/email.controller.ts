import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from '../services/email.service';

@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Post('')
  send(@Body('email') email: string) {
    return this.emailService.sendEmail(email);
  }
}
