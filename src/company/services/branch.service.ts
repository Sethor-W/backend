import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Branch } from '../models/branch.model';
import { Company } from '../models/company.model';
import { CompanyRepository } from '../repository/company.repository';
import { BranchRepository } from '../repository/branch.repository';
import { CreateBranchDTO } from '../dto/createBranch.dto';
import { UserBusinessService } from 'src/user/services/userBusiness.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch) private branchRepository: BranchRepository,
    @InjectRepository(Company) private companyRepository: CompanyRepository,
    private readonly userBusService: UserBusinessService,
  ) {}

  async create(
    data: CreateBranchDTO,
    companyId: { Id: string },
    userId: string,
  ) {
    const { address, phone, opening_days, opening_time, closing_time } = data;
    try {
      const user = await this.userBusService.getUserById(userId);
      const company = await this.companyRepository.findOneBy({
        id: companyId.Id,
        user,
      });
      if (!company) {
        return {
          ok: false,
          message: 'company not found',
        };
      }
      const newBranch = this.branchRepository.create({
        id: uuidv4(),
        address,
        phone,
        opening_days,
        opening_time,
        closing_time,
        company,
      });
      await this.branchRepository.save(newBranch);
      return newBranch;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getBranch(companyId: { Id: string }, userId: string) {
    try {
      const user = await this.userBusService.getUserById(userId);
      const company = await this.companyRepository.findOneBy({
        id: companyId.Id,
        user,
      });
      if (!company) {
        return {
          ok: false,
          message: 'compnay not found',
        };
      }
      const branchs = await this.branchRepository.find();
      return branchs;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getBranchById(id: string, companyId: { Id: string }, userId: string) {
    try {
      const user = await this.userBusService.getUserById(userId);
      const company = await this.companyRepository.findOneBy({
        id: companyId.Id,
        user,
      });
      if (!company) {
        return {
          ok: false,
          message: 'compnay not found',
        };
      }
      const branch = await this.branchRepository.findOneBy({ id });
      return branch;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateBranch(
    data: CreateBranchDTO,
    id: string,
    companyId: { Id: string },
    userId: string,
  ) {
    try {
      const user = await this.userBusService.getUserById(userId);
      const company = await this.companyRepository.findOneBy({
        id: companyId.Id,
        user,
      });
      if (!company) {
        return {
          ok: false,
          message: 'compnay not found',
        };
      }
      await this.branchRepository.update({ id }, data);
      return {
        ok: true,
        message: 'Update branch',
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteBranch(id: string, companyId: { Id: string }, userId: string) {
    try {
      const user = await this.userBusService.getUserById(userId);
      const company = await this.companyRepository.findOneBy({
        id: companyId.Id,
        user,
      });
      if (!company) {
        return {
          ok: false,
          message: 'compnay not found',
        };
      }
      await this.branchRepository.delete({ id });
      return {
        ok: true,
        messsage: 'Delete branch',
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getAllBranch() {
    try {
      const branches = await this.branchRepository.find();
      return branches;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
