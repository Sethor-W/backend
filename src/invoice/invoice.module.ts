import { Module } from '@nestjs/common';
import { InvoiceService } from './services/invoice.service';
import { InvoiceController } from './controllers/invoice.controller';

@Module({
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
