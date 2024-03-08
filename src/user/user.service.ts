import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './repository/user.repository';
import { User } from './models/user.model';
import { CreateUserDTO } from './dto/createUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: UserRepository,
  ) {}

  async createUser(user: CreateUserDTO) {
    const { name, lastName, rut, email, password, phone } = user;

    try {
      const hash = await bcrypt.hash(password, 10);
      const newUser = this.userRepository.create({
        name,
        lastName,
        rut,
        email,
        password: hash,
        phone,
      });
      await this.userRepository.save(newUser);
      return newUser;
    } catch (error) {
      throw new BadRequestException('new user could not be created', error);
    }
  }
}
