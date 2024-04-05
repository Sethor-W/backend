import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDTO } from 'src/user/dto/createUser.dto';
import { LoginDTO } from './dto/login.dto';
import { CreateUserBusDTO } from 'src/user/dto/createUserBus.dto';
import { GoogleAuthGuard } from './guards/google.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  register(@Body() user: CreateUserDTO) {
    return this.authService.register(user);
  }

  @Post('/login')
  login(@Body() data: LoginDTO) {
    return this.authService.login(data);
  }

  @Post('/register-business')
  registerBusiness(@Body() user: CreateUserBusDTO) {
    return this.authService.registerBusiness(user);
  }

  @Post('/login-business')
  loginBusiness(@Body() data: LoginDTO) {
    return this.authService.loginBusiness(data);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {
    return HttpStatus.OK;
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleLoginCallback() {
    return {
      status: HttpStatus.OK,
      redirect: true,
    };
  }
}
