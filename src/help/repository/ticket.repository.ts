import { Repository } from 'typeorm';
import { Ticket } from '../models/ticket.model';

export class TicketRepository extends Repository<Ticket> {}
