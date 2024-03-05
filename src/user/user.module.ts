import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './models/user.model';
import { Document } from './models/document.model';

@Module({
  imports: [TypeOrmModule.forFeature([User, Document])],
  providers: [UserService],
})
export class UserModule {}
