import { Router } from 'express';

import { verifyTokenMiddleware } from '../middlewares/verifyToken.middleware.js';
import { ProfileController } from '../controllers/profile.controller.js';

export const routerProfile = Router();

// Obtener perfil
routerProfile.get('/', [
    verifyTokenMiddleware,
], ProfileController.getUserProfile);
