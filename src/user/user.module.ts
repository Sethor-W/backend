import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './services/user.service';
import { User } from './models/user.model';
import { Document } from './models/document.model';
import { UserController } from './controllers/user.controller';
import { Encrypt } from 'src/encrypt/encrypt';

@Module({
  imports: [TypeOrmModule.forFeature([User, Document])],
  providers: [UserService, Encrypt],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
