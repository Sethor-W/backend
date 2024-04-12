import { Repository } from 'typeorm';
import { TemporaryCode } from '../models/temporary_code.model';

export class TemporaryCodeRepo extends Repository<TemporaryCode> {}
