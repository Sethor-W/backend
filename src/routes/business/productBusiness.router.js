import { Router } from 'express';

import {verifyTokenMiddleware} from '../../middlewares/verifyToken.middleware.js'
import { checkRoleMiddleware } from '../../middlewares/checkRole.middleware.js';
import { verifyAssociatedUserMiddleware } from '../../middlewares/verifyAssociatedUser.middleware.js';

import { rolesEnum } from '../../enum/roles.enum.js';
import { ProductBusinessController } from '../../controllers/business/product.controller.js';

export const routerProductBusiness = Router();


routerProductBusiness.post('/', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.OWNER,
        rolesEnum.MANAGER,
        rolesEnum.ADMIN
    ]),
    verifyAssociatedUserMiddleware,
], ProductBusinessController.registerProduct);


routerProductBusiness.get('/', [
    verifyTokenMiddleware,
], ProductBusinessController.getProductsByBusiness);


routerProductBusiness.put('/:productId', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.OWNER,
        rolesEnum.MANAGER,
        rolesEnum.ADMIN
    ]),
    verifyAssociatedUserMiddleware,
], ProductBusinessController.updateProduct);
