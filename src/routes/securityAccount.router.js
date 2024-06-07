import { Router } from 'express';

import { SecurityAccountController } from '../controllers/securityAccount.controller.js';
import {verifyTokenMiddleware} from '../middlewares/verifyToken.middleware.js'

export const routerSecurityAccount = Router();


routerSecurityAccount.post('/send-reset-password-code',SecurityAccountController.sendResetPasswordCode);

routerSecurityAccount.put('/reset-password',SecurityAccountController.resetPassword);

routerSecurityAccount.put('/change-password', [
    verifyTokenMiddleware
],SecurityAccountController.changePassword);