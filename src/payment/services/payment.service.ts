import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CardRepository } from '../repository/card.repository';
import { Card } from '../models/card.model';
import { RegisterCardDTO } from '../dto/registerCar.dto';
import { UserService } from 'src/user/services/user.service';
import { Encrypt } from 'src/encrypt/encrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Card) private readonly cardRepository: CardRepository,
    private userService: UserService,
    private encryptService: Encrypt,
  ) {}

  async registerCard(card: RegisterCardDTO, id: string) {
    const { titularName, number, cvv, expirationDate } = card;
    try {
      const user = await this.userService.getUserById(id);
      const newCard = this.cardRepository.create({
        id: uuidv4(),
        titularName: this.encryptService.encrypt(titularName),
        number: this.encryptService.encrypt(number.toString()),
        cvv: this.encryptService.encrypt(cvv.toString()),
        expirationDate: this.encryptService.encrypt(expirationDate),
        user,
      });
      await this.cardRepository.save(newCard);
      return newCard;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async getCardsInfo(): Promise<Card[]> {
    try {
      const cards = await this.cardRepository.find();
      const cardDecrypt = [];
      cards.forEach((card) =>
        cardDecrypt.push({
          id: card.id,
          titularName: this.encryptService.decrypt(card.titularName),
          number: this.encryptService.decrypt(card.number),
          cvv: this.encryptService.decrypt(card.cvv),
          expirationDate: this.encryptService.decrypt(card.expirationDate),
        }),
      );
      return cardDecrypt;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async delete(id: string) {
    try {
      const card = await this.cardRepository.findOneBy({ id });
      if (!card) {
        return {
          ok: false,
          message: 'Card not found',
        };
      }
      await this.cardRepository.delete(id);
      return {
        ok: true,
        message: 'Card delete',
      };
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
