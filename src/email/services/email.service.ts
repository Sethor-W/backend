import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import * as crypto from 'crypto';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  private generateOTP() {
    return crypto.randomBytes(64).toString('hex').substring(0, 6);
  }

  private createToken(otp: string, expiresIn: number) {
    const token = {
      otp,
      expiresAt: moment().add(expiresIn, 'seconds').toISOString(),
    };
    return JSON.stringify(token);
  }

  private verifyToken(token: string) {
    const parsedToken = JSON.parse(token);
    const now = moment();
    if (parsedToken.expiresAt < now.toISOString()) {
      return false;
    }
    return parsedToken.otp;
  }

  async sendEmail(email: string) {
    const otp = this.generateOTP();
    const token = this.createToken(otp, 120);

    await this.mailerService.sendMail({
      to: email,
      subject: 'Verify code',
      template: `<h3>Your code is: ${token}</h3>`,
      context: {
        token,
      },
    });
    return {
      message: 'email send',
    };
  }
}
