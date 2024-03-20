import { Repository } from 'typeorm';
import { Order } from '../models/order';

export class OrderRepository extends Repository<Order> {}
