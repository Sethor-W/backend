import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../repository/user.repository';
import { DocumentRepository } from '../repository/document.repository';
import { Document } from '../models/document.model';
import { User } from '../models/user.model';
import { VerificationDataDTO } from '../dto/verificationData.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: UserRepository,
    @InjectRepository(Document)
    private readonly documentRepository: DocumentRepository,
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

  async verified(
    verifyData: VerificationDataDTO,
    id: string,
  ): Promise<Document> {
    const { code, rutFrontalPhoto, rutDorsalPhoto, selfie } = verifyData;
    try {
      //if (code) return;
      const user = await this.userRepository.findOneBy({ id });
      const document = this.documentRepository.create({
        id: uuidv4(),
        rutFrontalPhoto,
        rutDorsalPhoto,
        selfie,
        user,
      });
      await this.documentRepository.save(document);
      return document;
    } catch (error) {
      console.error(error);
    }
  }

  ////// servicios especiales ////////////////////////
  async getUsers(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users;
  }

  async getUserById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new BadRequestException();
      }
      return user;
    } catch (error) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }
}
