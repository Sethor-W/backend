import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EmailService } from 'src/email/services/email.service';

@Injectable()
export class TaskService {
  constructor(private emailService: EmailService) {}
  // metodo para borrar los codigos de verificacion de la base de datos
  @Cron('0 0 * * *')
  async deleteCodeRegister() {
    //console.log('registro borrado');
    await this.emailService.deleteInvalidCodes();
  }
}
