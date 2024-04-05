import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyService } from './services/company.service';
import { CompanyController } from './controllers/company.controller';
import { Company } from './models/company.model';
import { Branch } from './models/branch.model';
import { Dish } from './models/dish.model';
import { Order } from './models/order';
import { OrderDetails } from './models/order_details';
import { UserModule } from 'src/user/user.module';
import { BranchService } from './services/branch.service';
import { BranchController } from './controllers/branch.controller';
import { DishService } from './services/dish.service';
import { DishController } from './controllers/dish.controller';
import { OrderService } from './services/orders.service';
import { OrderController } from './controllers/orders.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company, Branch, Dish, Order, OrderDetails]),
    UserModule,
  ],
  providers: [CompanyService, BranchService, DishService, OrderService],
  controllers: [
    CompanyController,
    BranchController,
    DishController,
    OrderController,
  ],
  exports: [OrderService],
})
export class CompanyModule {}
