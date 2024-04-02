import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO } from 'src/user/dto/createUser.dto';
import { UserService } from '../user/services/user.service';
import { UserBusinessService } from 'src/user/services/userBusiness.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { LoginDTO } from './dto/login.dto';
import { CreateUserBusDTO } from 'src/user/dto/createUserBus.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtServices: JwtService,
    private readonly userService: UserService,
    private readonly userBusiness: UserBusinessService,
  ) {}

  //registro de usuario
  async register(user: CreateUserDTO) {
    const { name, lastName, rut, email, password, phone } = user;

    try {
      const userByEmail = await this.userService.getUserByEmail(email);
      if (!userByEmail) {
        const hash = await bcrypt.hash(password, 10);
        const newUser = {
          id: uuidv4(),
          name,
          lastName,
          rut,
          email,
          password: hash,
          phone,
        };
        const payload = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
        };
        const token = this.jwtServices.sign(payload);
        await this.userService.createUser(newUser);
        return {
          token,
        };
      }
      return {
        ok: false,
        message: 'This email is registered',
      };
    } catch (error) {
      throw new BadRequestException('new user could not be created', error);
    }
  }

  // validar contraseña del usuario
  async validateUserPassword(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email);
    if (user) {
      try {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          const { id, name, email } = user;
          return {
            id,
            name,
            email,
          };
        } else {
          throw new UnauthorizedException('Invalid password');
        }
      } catch (error) {
        throw new HttpException('password not found', 301);
      }
    } else {
      throw new HttpException('user not found', 302);
    }
  }

  // login de usuario
  async login(data: LoginDTO) {
    const { email, password } = data;
    const validUser = await this.validateUserPassword(email, password);
    const payload = {
      id: validUser.id,
      name: validUser.name,
      email: validUser.email,
    };
    const token = this.jwtServices.sign(payload);
    return {
      token,
    };
  }

  // registro de usuario business
  async registerBusiness(user: CreateUserBusDTO) {
    const { name, lastName, rut, email, password, key_word, phone } = user;

    try {
      const userByEmail = await this.userBusiness.getUserByEmail(email);
      if (!userByEmail) {
        const hash = await bcrypt.hash(password, 10);
        const newUser = {
          id: uuidv4(),
          name,
          lastName,
          rut,
          email,
          password: hash,
          key_word,
          phone,
        };
        const payload = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          credential: `${newUser.rut}.${newUser.key_word}`,
        };
        const token = this.jwtServices.sign(payload);
        await this.userBusiness.createUser(newUser);
        return {
          token,
        };
      }
      return {
        ok: false,
        message: 'This email is registered',
      };
    } catch (error) {
      //throw new BadRequestException('new user could not be created', error);
      console.error(error);
    }
  }

  //validacion de contraseña para usuario business
  async validateUserBusPassword(email: string, password: string) {
    const user = await this.userBusiness.getUserByEmail(email);
    if (user) {
      try {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          const { id, name, email, credential } = user;
          return {
            id,
            name,
            email,
            credential,
          };
        } else {
          throw new UnauthorizedException('Invalid password');
        }
      } catch (error) {
        throw new HttpException('password not found', 301);
      }
    } else {
      throw new HttpException('user not found', 302);
    }
  }

  // login de usuario business
  async loginBusiness(data: LoginDTO) {
    const { email, password } = data;
    const validUser = await this.validateUserBusPassword(email, password);
    const payload = {
      id: validUser.id,
      name: validUser.name,
      email: validUser.email,
      credential: validUser.credential,
    };
    const token = this.jwtServices.sign(payload);
    return {
      token,
    };
  }
}
