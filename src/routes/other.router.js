import { Router } from 'express';

import {verifyTokenMiddleware} from '../middlewares/verifyToken.middleware.js'

import { OtherController } from '../controllers/other.controller.js';

export const routerOther = Router();

routerOther.post('/help', [
    verifyTokenMiddleware
], OtherController.help);

routerOther.post('/opinion-suggestion', [

], OtherController.opinionOrSuggestion);

routerOther.post('/representative-sethor', [
    verifyTokenMiddleware
], OtherController.representativeSethor);


