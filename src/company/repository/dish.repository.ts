import { Repository } from 'typeorm';
import { Dish } from '../models/dish.model';

export class DishRepository extends Repository<Dish> {}
