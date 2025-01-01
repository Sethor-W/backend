import { Router } from 'express';

import {verifyTokenMiddleware} from '../middlewares/verifyToken.middleware.js'
import { checkRoleMiddleware } from '../middlewares/checkRole.middleware.js';
import { verifyAssociatedUserMiddleware } from '../middlewares/verifyAssociatedUser.middleware.js';

import { ProductController } from '../controllers/product.controller.js';
import { rolesEnum } from '../enum/roles.enum.js';
import { ProductBusinessController } from '../controllers/business/product.controller.js';

export const routerProduct = Router();


routerProduct.get('/:productId', [
    verifyTokenMiddleware,
], ProductController.getProductById);

routerProduct.put('/:productId', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.OWNER,
        rolesEnum.MANAGER,
        rolesEnum.ADMIN
    ]),
    verifyAssociatedUserMiddleware,
], ProductController.updateProduct);

routerProduct.delete('/by-id/:businessId/:productId', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.OWNER,
        rolesEnum.MANAGER,
        rolesEnum.ADMIN
    ]),
    verifyAssociatedUserMiddleware,
], ProductController.deleteProduct);
