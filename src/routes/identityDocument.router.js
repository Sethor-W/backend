import { Router } from 'express';

import {verifyTokenMiddleware} from '../middlewares/verifyToken.middleware.js'
import { identityDocumentController } from '../controllers/identityDocument.controller.js';

export const routerIdentityDocument = Router();

routerIdentityDocument.post('/upload', [
    // verifyTokenMiddleware
], identityDocumentController.uploadIdentityDocuments);
