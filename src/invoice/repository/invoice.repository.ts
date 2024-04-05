import { Repository } from 'typeorm';
import { Invoice } from '../models/invoice.model';

export class InvoiceRepository extends Repository<Invoice> {}
