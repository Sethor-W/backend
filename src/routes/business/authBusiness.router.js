import { Router } from 'express';

import { AuthBusinessController } from '../../controllers/business/auth.controller.js';
import { verifyTokenMiddleware } from '../../middlewares/verifyToken.middleware.js';

export const routerAuthBusiness = Router();

routerAuthBusiness.post('/register', AuthBusinessController.register);

routerAuthBusiness.post('/login', AuthBusinessController.login);

routerAuthBusiness.get('/jwt', [
    verifyTokenMiddleware,
], AuthBusinessController.getDataJWT);