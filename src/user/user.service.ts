import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './repository/user.repository';
import { User } from './models/user.model';
import { CreateUserDTO } from './dto/createUser.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: UserRepository,
  ) {}

  async createUser(user) {
    const { id, name, lastName, rut, email, password, phone } = user;

    const newUser = this.userRepository.create({
      id,
      name,
      lastName,
      rut,
      email,
      password,
      phone,
    });
    await this.userRepository.save(newUser);
    return newUser;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }
}
