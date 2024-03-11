import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentController } from './controller/payment.controller';
import { PaymentService } from './services/payment.service';
import { Card } from './models/card.model';
import { UserModule } from 'src/user/user.module';
import { Encrypt } from 'src/encrypt/encrypt';

@Module({
  imports: [TypeOrmModule.forFeature([Card]), UserModule],
  controllers: [PaymentController],
  providers: [PaymentService, Encrypt],
})
export class PaymentModule {}
