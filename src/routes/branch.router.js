import { Router } from 'express';

import {verifyTokenMiddleware} from '../middlewares/verifyToken.middleware.js'
import { checkRoleMiddleware } from '../middlewares/checkRole.middleware.js';
import { verifyAssociatedUserMiddleware } from '../middlewares/verifyAssociatedUser.middleware.js';

import { BranchController } from '../controllers/branch.controller.js';
import { rolesEnum } from '../enum/roles.enum.js';

export const routerBranch = Router();

routerBranch.post('/:businessId', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.OWNER,
        rolesEnum.MANAGER,
        rolesEnum.ADMIN
    ]),
    verifyAssociatedUserMiddleware,
], BranchController.registerBranch);

routerBranch.get('/:businessId', [
    verifyTokenMiddleware,
], BranchController.getBranchesByBusiness);

routerBranch.get('/by-id/:branchId', [
    verifyTokenMiddleware,
], BranchController.getBrancheById);

routerBranch.put('/:businessId/:branchId', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.OWNER,
        rolesEnum.MANAGER,
        rolesEnum.ADMIN
    ]),
    verifyAssociatedUserMiddleware,
], BranchController.updateBranch);

routerBranch.delete('/:businessId/:branchId', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.OWNER,
        rolesEnum.MANAGER,
        rolesEnum.ADMIN
    ]),
    verifyAssociatedUserMiddleware,
], BranchController.deleteBranch);
