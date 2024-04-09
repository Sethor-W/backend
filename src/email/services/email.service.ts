import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import moment from 'moment';
import crypto from 'crypto';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  private generateOTP() {
    return crypto.randomBytes(64).toString('hex').substring(0, 6);
  }

  private createToken = (otp: string, expiresIn: number) => {
    const token = {
      otp,
      expiresAt: moment().add(expiresIn, 'seconds').toISOString(),
    };
    return JSON.stringify(token);
  };

  private verifyToken(token: string) {
    const parsedToken = JSON.parse(token);
    const now = moment();
    if (parsedToken.expiresAt < now.toISOString()) {
      return false;
    }
    return parsedToken.otp;
  }
}
