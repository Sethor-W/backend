import { Router } from 'express';

import {verifyTokenMiddleware} from '../middlewares/verifyToken.middleware.js'
import { checkRoleMiddleware } from '../middlewares/checkRole.middleware.js';

import { BusinessController } from '../controllers/business.controller.js';
import { rolesEnum } from '../enum/roles.enum.js';
import { verifyAssociatedUserMiddleware } from '../middlewares/verifyAssociatedUser.middleware.js';
import { BusinessCommonController } from '../controllers/common/business.controller.js';
import { BusinessClientController } from '../controllers/client/business.controller.js';

export const routerBusiness = Router();

routerBusiness.post('/', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.OWNER,
        rolesEnum.ADMIN
    ])
], BusinessController.registerBusiness);

routerBusiness.get('/:businessId', [
    verifyTokenMiddleware,
], BusinessCommonController.getBusinessAllDetailsById);



routerBusiness.get('/name/search', [
    verifyTokenMiddleware,
], BusinessController.searchBusinessByName);

routerBusiness.put('/:id', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.OWNER,
        rolesEnum.ADMIN
    ])
], BusinessController.updateBusiness);

routerBusiness.delete('/:id', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.OWNER,
        rolesEnum.ADMIN
    ])
], BusinessController.deleteBusiness);

/**
 * PUBLIC
 */

// Todas las empresas
routerBusiness.get('/', [
    verifyTokenMiddleware,
], BusinessClientController.getAllBusiness);

/**
 * EMPLOYEE
 */

routerBusiness.get('/employee/getBusiness', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.MANAGER,
        rolesEnum.COLLECTOR,
        rolesEnum.OWNER,
        rolesEnum.ADMIN,
    ]),
], BusinessController.getBusinessDetailsToEmployeeWithJWT)

routerBusiness.get('/employee/getAllBusiness/:businessId', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.OWNER,
        rolesEnum.MANAGER,
        rolesEnum.COLLECTOR,
        rolesEnum.ADMIN
    ]),
    verifyAssociatedUserMiddleware,
], BusinessController.getBusinessDetailsToEmployee)

/**
 * OWNER
 */
routerBusiness.get('/owner/getAllBusiness', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.OWNER,
        rolesEnum.ADMIN
    ])
], BusinessController.getAllBusinessByOwner)