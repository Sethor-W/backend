import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/createUser.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/')
  createUser(@Body() user: CreateUserDTO) {
    return this.userService.createUser(user);
  }
}
