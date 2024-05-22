import { Router } from 'express';

import {verifyTokenMiddleware} from '../middlewares/verifyToken.middleware.js'
import { checkRoleMiddleware } from '../middlewares/checkRole.middleware.js';
import { verifyAssociatedUserMiddleware } from '../middlewares/verifyAssociatedUser.middleware.js';

import { ProductController } from '../controllers/product.controller.js';
import { rolesEnum } from '../enum/roles.enum.js';

export const routerProduct = Router();

routerProduct.post('/:businessId/branch/:branchId', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.OWNER,
        rolesEnum.MANAGER,
        rolesEnum.ADMIN
    ]),
    verifyAssociatedUserMiddleware,
], ProductController.registerProduct);

routerProduct.get('/by-business/:businessId', [
    verifyTokenMiddleware,
], ProductController.getProductsByBusiness);

routerProduct.get('/by-id/:productId', [
    verifyTokenMiddleware,
], ProductController.getProductById);

routerProduct.put('/by-id/:businessId/:productId', [
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
