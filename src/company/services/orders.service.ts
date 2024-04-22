import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderRepository } from '../repository/orders.repository';
import { Order } from '../models/order';
import { OrderDetails } from '../models/order_details';
import { OrederDetailsRepository } from '../repository/order_details.repository';
import { BranchRepository } from '../repository/branch.repository';
import { UserService } from '../../user/services/user.service';
import { v4 as uuidv4 } from 'uuid';
import { Branch } from '../models/branch.model';
import { CreateOrderDTO } from '../dto/createOrder.dto';
import { EmployeeService } from 'src/employee/services/employee.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: OrderRepository,
    @InjectRepository(OrderDetails)
    private orderDetailsRepository: OrederDetailsRepository,
    @InjectRepository(Branch) private branchRepository: BranchRepository,
    private userService: UserService,
    private employeeService: EmployeeService,
  ) {}

  async create(
    employeeId: string,
    userId: string,
    branchId: string,
    data: CreateOrderDTO,
  ) {
    try {
      const user = await this.userService.getUserById(userId);
      const branch = await this.branchRepository.findOneBy({ id: branchId });
      const employee = await this.employeeService.getEmployeeById(employeeId);
      const order = this.orderRepository.create({
        id: uuidv4(),
        branch,
        user,
        employee,
      });
      await this.orderRepository.save(order);
      for (let i = 0; i < data.order_data.length; i++) {
        const orderDetail = this.orderDetailsRepository.create({
          id: uuidv4(),
          amount: data[i].order_data.amount,
          dish: data[i].order_data.dish,
          order,
        });
        await this.orderDetailsRepository.save(orderDetail);
        return {
          ok: true,
          message: 'order check',
        };
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getOrderByUser(userId: string) {
    try {
      const orders = await this.orderDetailsRepository.find({
        relations: {
          order: false,
        },
        where: {
          order: {
            user: { id: userId },
          },
        },
      });
      if (!orders) {
        return {
          ok: false,
          message: 'the user has no orders',
        };
      }
      return {
        ok: true,
        data: orders,
      };
    } catch (error) {}
  }

  async getOrderById(id: string) {
    try {
      const order = await this.orderRepository.findOneBy({ id });
      return order;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
