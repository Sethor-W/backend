import { Router } from 'express';

import {verifyTokenMiddleware} from '../../middlewares/verifyToken.middleware.js'
import { ProductCommonController } from '../../controllers/common/product.controller.js';

export const routerProductCommon = Router();


routerProductCommon.get('/', [
    verifyTokenMiddleware,
], ProductCommonController.getProductsByBusiness);

routerProductCommon.get('/:productId', [
    verifyTokenMiddleware,
], ProductCommonController.getProductById);
