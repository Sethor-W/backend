import { Router } from 'express';

import { AuthController } from '../../controllers/client/auth.controller.js';


export const routerAuth = Router();

routerAuth.post('/register', AuthController.register);

routerAuth.post('/login', AuthController.login);


