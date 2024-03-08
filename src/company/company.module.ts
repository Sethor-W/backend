import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyService } from './services/company.service';
import { CompanyController } from './controllers/company.controller';
import { Company } from './models/company.model';
import { Branch } from './models/branch.model';
import { Dish } from './models/dish.model';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Branch, Dish])],
  providers: [CompanyService],
  controllers: [CompanyController],
})
export class CompanyModule {}
