import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './models/card.model';

@Module({
  imports: [TypeOrmModule.forFeature([Card])],
})
export class PaymentModule {}
