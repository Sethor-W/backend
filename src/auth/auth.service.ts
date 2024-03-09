import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO } from 'src/user/dto/createUser.dto';
import { UserRepository } from 'src/user/repository/user.repository';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private jwtServices: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async register(user: CreateUserDTO): Promise<string> {
    const { name, lastName, rut, email, password, phone } = user;
    try {
      const hash = await bcrypt.hash(password, 10);
      const newUser = this.userRepository.create({
        id: uuidv4(),
        name,
        lastName,
        rut,
        email,
        password: hash,
        phone,
      });
      const payload = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      };
      const token = this.jwtServices.sign(payload);
      await this.userRepository.save(newUser);
      return token;
    } catch (error) {
      throw new BadRequestException('new user could not be created', error);
    }
  }
}
