import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PaymentModule } from './payment/payment.module';
import { CompanyModule } from './company/company.module';
import { AuthModule } from './auth/auth.module';
import { StorageModule } from './storage/storage.module';
import { HelpModule } from './help/help.module';

const config = new ConfigService();

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config.get('DB_HOST'),
      port: config.get('DB_PORT'),
      username: config.get('DB_USER'),
      password: config.get('DB_PASSWORD'),
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    CompanyModule,
    PaymentModule,
    AuthModule,
    StorageModule,
    HelpModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
