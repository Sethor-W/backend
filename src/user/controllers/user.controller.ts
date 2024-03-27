import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Param,
  Req,
  Put,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateUserDTO } from '../dto/createUser.dto';
import { VerificationDataDTO } from '../dto/verificationData.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/')
  createUser(@Body() user: CreateUserDTO) {
    return this.userService.createUser(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/verified')
  verified(@Body() verificationData: VerificationDataDTO, @Req() req: Request) {
    return this.userService.verified(verificationData, req['user']['id']);
  }

  //@UseGuards(JwtAuthGuard)
  @Get('/')
  getUser() {
    return this.userService.getUsers();
  }

  // revisar
  @UseGuards(JwtAuthGuard)
  @Get('/matched-password')
  match(@Query('password') password: string, @Req() req: Request) {
    return this.userService.isMatchPassword(req['user']['id'], password);
  }

  @Get('/:id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/change-password')
  changePassword(
    @Query('newPassword') newPassword: string,
    @Req() req: Request,
  ) {
    return this.userService.changePassword(req['user']['id'], newPassword);
  }
}
