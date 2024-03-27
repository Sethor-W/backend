import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClaimRepository } from '../repository/claim.repository';
import { SuggestionRepository } from '../repository/suggestion.repository';
import { TicketRepository } from '../repository/ticket.repository';
import { Claim } from '../models/claim.model';
import { Suggestion } from '../models/suggestion.model';
import { Ticket } from '../models/ticket.model';
import { HelpDTO } from '../dto/help.dto';
import { UserService } from 'src/user/services/user.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class HelpService {
  constructor(
    @InjectRepository(Claim) private claimRepository: ClaimRepository,
    @InjectRepository(Suggestion)
    private suggestionRepository: SuggestionRepository,
    @InjectRepository(Ticket)
    private ticketRepository: TicketRepository,
    private userService: UserService,
  ) {}

  async createClaim(userId: string, data: HelpDTO) {
    try {
      const user = await this.userService.getUserById(userId);
      const claim = this.claimRepository.create({
        id: uuidv4(),
        title: data.title,
        content: data.content,
        user,
      });
      await this.claimRepository.save(claim);
      return claim;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async createSuggestion(userId: string, data: HelpDTO) {
    try {
      const user = await this.userService.getUserById(userId);
      const claim = this.suggestionRepository.create({
        id: uuidv4(),
        title: data.title,
        content: data.content,
        user,
      });
      await this.suggestionRepository.save(claim);
      return claim;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async createTicket(userId: string, data: HelpDTO) {
    try {
      const user = await this.userService.getUserById(userId);
      const claim = this.ticketRepository.create({
        id: uuidv4(),
        title: data.title,
        content: data.content,
        user,
      });
      await this.ticketRepository.save(claim);
      return claim;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
