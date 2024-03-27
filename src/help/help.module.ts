import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelpService } from './services/help.service';
import { HelpController } from './controller/help.controller';
import { Claim } from './models/claim.model';
import { Suggestion } from './models/suggestion.model';
import { Ticket } from './models/ticket.model';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Claim, Suggestion, Ticket]), UserModule],
  providers: [HelpService],
  controllers: [HelpController],
})
export class HelpModule {}
