import { Router } from 'express';

import { CodeController } from '../controllers/code.controller.js';


export const routerCode = Router();

routerCode.post('/email/send', CodeController.sendCodeToEmail);
routerCode.post('/email/verify', CodeController.verifyCodeSentToEmail);
