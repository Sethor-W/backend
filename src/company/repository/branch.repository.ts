import { Repository } from 'typeorm';
import { Branch } from '../models/branch.model';

export class BranchRepository extends Repository<Branch> {}
