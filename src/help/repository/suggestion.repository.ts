import { Repository } from 'typeorm';
import { Suggestion } from '../models/suggestion.model';

export class SuggestionRepository extends Repository<Suggestion> {}
