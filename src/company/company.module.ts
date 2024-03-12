import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyService } from './services/company.service';
import { CompanyController } from './controllers/company.controller';
import { Company } from './models/company.model';
import { Branch } from './models/branch.model';
import { Dish } from './models/dish.model';
import { OrderDetails } from './models/order_details';
import { UserModule } from 'src/user/user.module';
import { BranchService } from './services/branch.service';
import { BranchController } from './controllers/branch.controller';
import { DishService } from './services/dish.service';
import { DishController } from './controllers/dish.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company, Branch, Dish, OrderDetails]),
    UserModule,
  ],
  providers: [CompanyService, BranchService, DishService],
  controllers: [CompanyController, BranchController, DishController],
})
export class CompanyModule {}
