import { Router } from 'express';
import { StorageController } from '../controllers/storage.controller.js';
import { verifyTokenMiddleware } from '../middlewares/verifyToken.middleware.js';
import { uploadFileMiddleware } from '../middlewares/upload.middleware.js';

export const routerStorage = Router();

routerStorage.post('/upload/:nameFolder', [
    verifyTokenMiddleware,
    uploadFileMiddleware
], StorageController.uploadFile);
