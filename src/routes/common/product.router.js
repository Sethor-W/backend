import { Router } from 'express';

import {verifyTokenMiddleware} from '../../middlewares/verifyToken.middleware.js'
import { checkRoleMiddleware } from '../../middlewares/checkRole.middleware.js';
import { verifyAssociatedUserMiddleware } from '../../middlewares/verifyAssociatedUser.middleware.js';

import { ProductController } from '../../controllers/product.controller.js';
import { rolesEnum } from '../../enum/roles.enum.js';
import { ProductCommonController } from '../../controllers/common/product.controller.js';

export const routerProductCommon = Router();


routerProductCommon.get('/', [
    verifyTokenMiddleware,
], ProductCommonController.getProductsByBusiness);

routerProductCommon.get('/:productId', [
    verifyTokenMiddleware,
], ProductCommonController.getProductById);



routerProductCommon.delete('/by-id/:businessId/:productId', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.OWNER,
        rolesEnum.MANAGER,
        rolesEnum.ADMIN
    ]),
    verifyAssociatedUserMiddleware,
], ProductController.deleteProduct);
