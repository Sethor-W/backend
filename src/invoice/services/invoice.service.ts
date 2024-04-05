import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvoiceRepository } from '../repository/invoice.repository';
import { Invoice } from '../models/invoice.model';
import { CreateInvoiceDTO } from '../dto/createInvoice.dto';
import { v4 as uuidv4 } from 'uuid';
import { OrderService } from 'src/company/services/orders.service';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice) private readonly invoiceRepos: InvoiceRepository,
    private readonly orderService: OrderService,
  ) {}

  async createInvoice(data: CreateInvoiceDTO, orderId: string) {
    const {
      businessName,
      branchAdress,
      businessType,
      card,
      cardHolder,
      iva,
      sth,
      subTotal,
      suplier,
      total,
      typeBiometric,
    } = data;
    try {
      const order = await this.orderService.getOrderById(orderId);
      const invoice = this.invoiceRepos.create({
        id: uuidv4(),
        businessName,
        branchAdress,
        businessType,
        card,
        cardHolder,
        iva,
        sth,
        subTotal,
        suplier,
        total,
        typeBiometric,
        order,
      });

      await this.invoiceRepos.save(invoice);
      return invoice;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getInvoiceId(id: string) {
    try {
      const invoice = await this.invoiceRepos.findOneBy({ id });
      return invoice;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
