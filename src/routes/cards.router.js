import { Router } from 'express';

import { CardController } from '../controllers/payment/card.controller.js';

export const routerCard = Router();

routerCard.post('/', CardController.saveCard);

routerCard.get('/:cardId', CardController.getDecryptedCard);
