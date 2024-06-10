import { Router } from 'express';

import { verifyTokenMiddleware } from '../middlewares/verifyToken.middleware.js';
import { ProfileBusinessController } from '../controllers/profileBusiness.controller.js';

export const routerProfileBusiness = Router();

// Obtener perfil
routerProfileBusiness.get('/', [
    verifyTokenMiddleware,
], ProfileBusinessController.getUserProfile);

// actualizar perfil
routerProfileBusiness.put('/', [
    verifyTokenMiddleware,
], ProfileBusinessController.updateUserProfile);
