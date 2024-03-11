import { Repository } from 'typeorm';
import { Company } from '../models/company.model';

export class CompanyRepository extends Repository<Company> {}
