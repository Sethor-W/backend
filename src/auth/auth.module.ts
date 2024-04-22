import { Module } from '@nestjs/common';
//import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtBusinessStrategy } from './strategy/jwtBusiness.strategy';
import { JwtManagerStrategy } from './strategy/jwtManager.strategy';
import { GoogleAuthStrategy } from './strategy/google.strategy';
import { EmployeeModule } from 'src/employee/employee.module';

//const config = new ConfigService();

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'secret-key',
      signOptions: { expiresIn: '29d' },
    }),
    UserModule,
    EmployeeModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    JwtBusinessStrategy,
    JwtManagerStrategy,
    GoogleAuthStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
