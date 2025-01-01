import { Router } from 'express';

import {verifyTokenMiddleware} from '../../middlewares/verifyToken.middleware.js'
import { checkRoleMiddleware } from '../../middlewares/checkRole.middleware.js';
import { verifyAssociatedUserMiddleware } from '../../middlewares/verifyAssociatedUser.middleware.js';

import { rolesEnum } from '../../enum/roles.enum.js';
import { ReportBusinessController } from '../../controllers/business/report.controller.js';

export const routerReportBusiness = Router();


routerReportBusiness.get('/', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.OWNER,
        rolesEnum.MANAGER,
        rolesEnum.ADMIN
    ]),
    verifyAssociatedUserMiddleware,
], ReportBusinessController.getMonthlyStatistics);

