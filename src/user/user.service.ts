import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './repository/user.repository';
import { User } from './models/user.model';
import { CreateUserDTO } from './dto/createUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: UserRepository,
  ) {}

  async createUser(user: CreateUserDTO) {
    try {
      const newUser = this.userRepository.create(user);
      await this.userRepository.save(newUser);
      return newUser;
    } catch (error) {
      throw new BadRequestException('new user could not be created', error);
    }
  }
}
