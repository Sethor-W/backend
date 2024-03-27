import { Repository } from 'typeorm';
import { Claim } from '../models/claim.model';

export class ClaimRepository extends Repository<Claim> {}
