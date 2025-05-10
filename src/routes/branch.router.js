import { Router } from 'express';

import {verifyTokenMiddleware} from '../middlewares/verifyToken.middleware.js'
import { checkRoleMiddleware } from '../middlewares/checkRole.middleware.js';
import { verifyAssociatedUserMiddleware } from '../middlewares/verifyAssociatedUser.middleware.js';

import { rolesEnum } from '../enum/roles.enum.js';
import { BranchBusinessController } from '../controllers/business/branch.controller.js';

export const routerBranch = Router();

routerBranch.post('/', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.OWNER,
        rolesEnum.MANAGER,
        rolesEnum.ADMIN
    ]),
    verifyAssociatedUserMiddleware,
], BranchBusinessController.registerBranch);


routerBranch.get('/:branchId', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.OWNER,
        rolesEnum.MANAGER,
        rolesEnum.ADMIN
    ]),
    verifyAssociatedUserMiddleware,
], BranchBusinessController.getBrancheById);


routerBranch.get('/', [
    verifyTokenMiddleware,
], BranchBusinessController.getBranchesByBusiness);


routerBranch.put('/:branchId', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.OWNER,
        rolesEnum.MANAGER,
        rolesEnum.ADMIN
    ]),
    verifyAssociatedUserMiddleware,
], BranchBusinessController.updateBranch);

routerBranch.delete('/:branchId', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.OWNER,
        rolesEnum.MANAGER,
        rolesEnum.ADMIN
    ]),
    verifyAssociatedUserMiddleware,
], BranchBusinessController.deleteBranch);
