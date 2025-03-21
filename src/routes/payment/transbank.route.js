import { Router } from 'express';

import { verifyTokenMiddleware } from '../../middlewares/verifyToken.middleware.js';
import { OneClickTransbankController } from '../../controllers/payment/oneClick.controller.js';

export const routerTransbank = Router();

routerTransbank.post('/oneclick/inscriptions', [
    // verifyTokenMiddleware,
], OneClickTransbankController.createInscription);

routerTransbank.put('/oneclick/inscriptions/:token', [
    // verifyTokenMiddleware,
], OneClickTransbankController.confirmInscription);

routerTransbank.delete('/oneclick/inscriptions', [
    // verifyTokenMiddleware,
], OneClickTransbankController.deleteInscription);

routerTransbank.post('/oneclick/authorize', [
    // verifyTokenMiddleware,
], OneClickTransbankController.authorizeTransaction);
