import { Repository } from 'typeorm';
import { Card } from '../models/card.model';

export class CardRepository extends Repository<Card> {}
