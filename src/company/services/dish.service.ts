import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DishRepository } from '../repository/dish.repository';
import { Dish } from '../models/dish.model';
import { CreateDishDTO } from '../dto/createDish.dto';
import { Branch } from '../models/branch.model';
import { BranchRepository } from '../repository/branch.repository';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DishService {
  constructor(
    @InjectRepository(Dish) private dishRepository: DishRepository,
    @InjectRepository(Branch) private branchRepository: BranchRepository,
  ) {}

  async create(data: CreateDishDTO, branchId: string) {
    const { name, description, price } = data;
    try {
      const branch = await this.branchRepository.findOneBy({ id: branchId });
      if (!branch) {
        return {
          ok: false,
          message: 'branch not found',
        };
      }
      const newDish = this.dishRepository.create({
        id: uuidv4(),
        name,
        description,
        price,
        branch,
      });
      await this.dishRepository.save(newDish);
      return {
        ok: true,
        data: newDish,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  // falta probar
  async getDishes(branchId: string) {
    try {
      const branch = await this.branchRepository.findOneBy({ id: branchId });
      if (!branch) {
        return {
          ok: false,
          message: 'branch not found',
        };
      }
      const dishes = await this.dishRepository.findBy({ branch });
      return dishes;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  //falta probar
  async getOneDish(id: string) {
    try {
      const dish = await this.dishRepository.findOneBy({ id });
      if (!dish) {
        return {
          ok: false,
          message: 'dish not found',
        };
      }
      return dish;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
