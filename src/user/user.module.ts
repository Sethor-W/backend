import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './models/user.model';
import { Document } from './models/document.model';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Document])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
