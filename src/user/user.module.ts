import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './services/user.service';
import { User } from './models/user.model';
import { Document } from './models/document.model';
import { UserController } from './controllers/user.controller';
import { Encrypt } from 'src/encrypt/encrypt';
import { UserBusiness } from './models/userBusiness.model';
import { UserBusinessService } from './services/userBusiness.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserBusiness, Document])],
  providers: [UserService, Encrypt, UserBusinessService],
  controllers: [UserController],
  exports: [UserService, UserBusinessService],
})
export class UserModule {}
