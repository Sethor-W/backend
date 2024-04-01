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
import { Encrypt } from 'src/encrypt/encrypt';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common/exceptions/internal-server-error.exception';
import { CreateUserDTO } from '../dto/createUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: UserRepository,
    @InjectRepository(Document)
    private readonly documentRepository: DocumentRepository,
    private readonly encryptService: Encrypt,
  ) {}
  /* crear ususario
   * @param {CreateUserDTO}
   * @return {newUser}
   *
   */
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

  async createPin(userId: string, pin: number) {
    try {
      await this.userRepository.update({ id: userId }, { pin });
      return {
        ok: true,
        message: `Create pin for User ${userId}`,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }

  async verified(
    verifyData: VerificationDataDTO,
    id: string,
  ): Promise<Document | { ok: boolean; message: string }> {
    const { code, rutFrontalPhoto, rutDorsalPhoto, selfie } = verifyData;
    try {
      //if (code) return;
      const user = await this.userRepository.findOneBy({ id });
      const userDocument = await this.documentRepository.findOneBy({ user });
      if (!userDocument) {
        const document = this.documentRepository.create({
          id: uuidv4(),
          rutFrontalPhoto: this.encryptService.encrypt(rutFrontalPhoto),
          rutDorsalPhoto: this.encryptService.encrypt(rutDorsalPhoto),
          selfie: this.encryptService.encrypt(selfie),
          user,
        });
        await this.documentRepository.save(document);
        return document;
      } else {
        return {
          ok: false,
          message: 'Previously verified user',
        };
      }
    } catch (error) {
      console.error(error);
    }
  }

  // async updateAvatar(url: string){
  //   try {

  //   } catch (error) {

  //   }
  // }

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

  async isMatchPassword(userId: string, password: string) {
    try {
      const user = await this.getUserById(userId);
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new BadRequestException('Password not match');
      }
      return {
        ok: true,
        message: 'Match password',
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async updateUser(userId: string, data: CreateUserDTO) {
    try {
      await this.userRepository.update({ id: userId }, data);
      return {
        ok: true,
        message: `User ${userId} in change`,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async changePassword(userId: string, newPassword: string) {
    try {
      const hash = await bcrypt.hash(newPassword, 10);
      await this.userRepository.update({ id: userId }, { password: hash });
      return {
        ok: true,
        message: 'Password changed',
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
