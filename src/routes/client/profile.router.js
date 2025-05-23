import { Router } from 'express';

import { verifyTokenMiddleware } from '../../middlewares/verifyToken.middleware.js';
import { ProfileController } from '../../controllers/client/profile.controller.js';

export const routerProfile = Router();

// Obtener perfil
routerProfile.get('/', [
    verifyTokenMiddleware,
], ProfileController.getUserProfile);

// actualizar perfil
routerProfile.put('/', [
    verifyTokenMiddleware,
], ProfileController.updateUserProfile);


// Obtener perfil by id
routerProfile.get('/:userId', [
    verifyTokenMiddleware,
], ProfileController.getUserProfileById);
