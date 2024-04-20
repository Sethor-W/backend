import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import * as crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { TemporaryCodeRepo } from '../repository/tempCode.repository';
import { TemporaryCode } from '../models/temporary_code.model';
import { template } from '../templates/email_template';

@Injectable()
export class EmailService {
  constructor(
    private mailerService: MailerService,
    @InjectRepository(TemporaryCode)
    private temporaryCodeRepo: TemporaryCodeRepo,
  ) {}

  private generateOTP() {
    return crypto.randomBytes(64).toString('hex').substring(0, 6);
  }

  // private createToken(otp: string, expiresIn: number) {
  //   const token = {
  //     otp,
  //     expiresAt: moment().add(expiresIn, 'seconds').toISOString(),
  //   };
  //   return JSON.stringify(token);
  // }

  private calculateTimeDifference(
    minA: number,
    secA: number,
    minB: number,
    secB: number,
  ) {
    // Convert minutes to seconds
    const totalSecondsA = minA * 60 + secA;
    const totalSecondsB = minB * 60 + secB;

    // Calculate the difference in seconds
    const timeDifferenceInSeconds = totalSecondsB - totalSecondsA;

    // Convert the difference in seconds to minutes and seconds
    const minutes = Math.floor(timeDifferenceInSeconds / 60);
    const remainingSeconds = Math.floor(timeDifferenceInSeconds % 60);

    // Return the difference as an object with minutes and seconds properties
    return {
      minutes,
      seconds: remainingSeconds,
    };
  }

  //revisar y actualizar
  private verifyToken(token: string) {
    const parsedToken = JSON.parse(token);
    const now = moment();
    if (parsedToken.expiresAt < now.toISOString()) {
      return false;
    }
    return {
      ok: true,
      code: parsedToken.otp,
    };
  }

  async sendEmail(email: string) {
    const code = this.generateOTP();

    const temp_code = this.temporaryCodeRepo.create({
      code,
      user_email: email,
      active: true,
      minute: new Date().getMinutes(),
      seconds: new Date().getSeconds(),
    });

    await this.temporaryCodeRepo.save(temp_code);
    //return temp_code;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Verify code',
      html: template(code),
      context: {
        code,
      },
    });
    return {
      message: 'email send',
      code,
    };
  }

  async verifyCode(data: { code: string; email: string }) {
    try {
      const temp_code = await this.temporaryCodeRepo.findOneBy({
        user_email: data.email,
      });
      const nowMinute = new Date().getMinutes();
      const nowSecond = new Date().getSeconds();
      const initMinute = temp_code.minute;
      const initSecond = temp_code.seconds;

      const dif = this.calculateTimeDifference(
        initMinute,
        initSecond,
        nowMinute,
        nowSecond,
      );
      if (data.code === temp_code.code && temp_code.active === true) {
        if (dif.minutes < 2) {
          await this.temporaryCodeRepo.update(
            {
              user_email: temp_code.user_email,
            },
            { active: false },
          );
          return {
            ok: true,
            dif,
            message: 'valid code',
          };
        } else {
          return {
            ok: false,
            message: 'expired code',
          };
        }
      }
      return {
        ok: false,
        message: 'not valid code',
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
