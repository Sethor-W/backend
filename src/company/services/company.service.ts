import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyRepository } from '../repository/company.repository';
import { Company } from '../models/company.model';
import { CreateCompanyDTO } from '../dto/createCompany.dto';
import { UserService } from 'src/user/services/user.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company) private companyRepository: CompanyRepository,
    private userService: UserService,
  ) {}

  async register(data: CreateCompanyDTO, id: string) {
    const { name, phone, description } = data;
    try {
      const user = await this.userService.getUserById(id);
      const newComp = this.companyRepository.create({
        id: uuidv4(),
        name,
        phone,
        description,
        user,
      });
      await this.companyRepository.save(newComp);
      return newComp;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getCompany(id: string) {
    try {
      const user = await this.userService.getUserById(id);
      const companies = await this.companyRepository.findBy({ user });
      return companies;
    } catch (error) {
      throw new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }

  async delete(id: string, userId: string) {
    try {
      const user = await this.userService.getUserById(userId);
      const company = await this.companyRepository.findOneBy({
        id,
        user,
      });
      if (!company) {
        return {
          ok: false,
          message: 'Company not found',
        };
      }
      await this.companyRepository.delete(id);
      return {
        ok: true,
        message: 'Company delete',
      };
    } catch (error) {}
  }

  // revisar los modelos de Company y Branch
  async update(data: CreateCompanyDTO, id: string, userId: string) {
    try {
      const user = await this.userService.getUserById(userId);
      const company = await this.companyRepository.findOneBy({
        id,
        user,
      });
      if (!company) {
        return {
          ok: false,
          message: 'Company not found',
        };
      }
      await this.companyRepository.update({ id }, data);
      return {
        ok: true,
        message: 'company info updated',
      };
    } catch (error) {}
  }
}
