import { Repository } from 'typeorm';
import { Document } from '../models/document.model';

export class DocumentRepository extends Repository<Document> {}
