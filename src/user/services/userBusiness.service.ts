import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserBusinessRepo } from '../repository/userBusiness.repository';
import { CreateUserBusDTO } from '../dto/createUserBus.dto';
import { UserBusiness } from '../models/userBusiness.model';

@Injectable()
export class UserBusinessService {
  constructor(
    @InjectRepository(UserBusiness) private userBusinessRepo: UserBusinessRepo,
  ) {}

  async createUser(data: CreateUserBusDTO) {
    const { id, name, lastName, rut, email, password, key_word, phone } = data;
    try {
      const user = this.userBusinessRepo.create({
        id,
        name,
        lastName,
        rut,
        email,
        password,
        key_word,
        credential: `${rut}.${key_word}`,
        phone,
      });
      await this.userBusinessRepo.save(user);
      return user;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getUserByEmail(email: string) {
    const user = await this.userBusinessRepo.findOneBy({ email });
    return user;
  }

  async getUserById(id: string) {
    try {
      const user = await this.userBusinessRepo.findOneBy({ id });
      if (!user) {
        throw new BadRequestException();
      }
      return user;
    } catch (error) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  generateEP() {
    const caracteres =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let codigo = '';
    // Generar 9 caracteres aleatorios
    for (let i = 0; i < 6; i++) {
      const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
      codigo += caracteres[indiceAleatorio];
    }

    return codigo;
  }
}
