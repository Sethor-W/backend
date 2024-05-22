import { Router } from 'express';
import { StatisticsController } from '../controllers/statistics.controller.js';
import { verifyTokenMiddleware } from '../middlewares/verifyToken.middleware.js';
import { checkRoleMiddleware } from '../middlewares/checkRole.middleware.js';
import { rolesEnum } from '../enum/roles.enum.js';
import { verifyAssociatedUserMiddleware } from '../middlewares/verifyAssociatedUser.middleware.js';

export const routerStatistics = Router();

routerStatistics.get('/business/:businessId/getAll', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.OWNER,
        rolesEnum.MANAGER,
        rolesEnum.ADMIN
    ]),
    verifyAssociatedUserMiddleware,
], StatisticsController.getAllStatistics);

routerStatistics.get('/business/:businessId/sold-products', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.OWNER,
        rolesEnum.MANAGER,
        rolesEnum.ADMIN
    ]),
    verifyAssociatedUserMiddleware,
], StatisticsController.getSoldProducts);

routerStatistics.get('/business/:businessId/buying-users', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.OWNER,
        rolesEnum.MANAGER,
        rolesEnum.ADMIN
    ]),
    verifyAssociatedUserMiddleware,
], StatisticsController.getBuyingUsers);

routerStatistics.get('/business/:businessId/monthly-earnings', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.OWNER,
        rolesEnum.MANAGER,
        rolesEnum.ADMIN
    ]),
    verifyAssociatedUserMiddleware,
], StatisticsController.getMonthlyEarnings);
