import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './services/email.service';
import { EmailController } from './controllers/email.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          secure: false,
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Reply <${config.get('MAIL_FROM')}>"`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService],
  controllers: [EmailController],
})
export class EmailModule {}
