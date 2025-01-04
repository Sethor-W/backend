import { Router } from 'express';

import { verifyTokenMiddleware } from '../../middlewares/verifyToken.middleware.js';
import { checkRoleMiddleware } from '../../middlewares/checkRole.middleware.js';
import { verifyAssociatedUserMiddleware } from '../../middlewares/verifyAssociatedUser.middleware.js';

import { EmployeeManagementController } from '../../controllers/business/employeeManagement.controller.js';
import { rolesEnum } from '../../enum/roles.enum.js';

export const routerEmployeeManagement = Router();


// Crear a new employee collector
routerEmployeeManagement.post('/collector', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.OWNER,
        rolesEnum.MANAGER,
        rolesEnum.ADMIN
    ]),
    verifyAssociatedUserMiddleware,
], EmployeeManagementController.createCollectorEmployeeCredentials);



// Obtiene los empleados asociados a una empresa
routerEmployeeManagement.get('/collector/:employeeId', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.OWNER,
        rolesEnum.MANAGER,
        rolesEnum.COLLECTOR,
        rolesEnum.ADMIN
    ]),
    verifyAssociatedUserMiddleware,
], EmployeeManagementController.getEmployeeCollectorDetails);


// Obtiene los empleados asociados a una empresa
routerEmployeeManagement.get('/', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.OWNER,
        rolesEnum.MANAGER,
        rolesEnum.ADMIN
    ]),
    verifyAssociatedUserMiddleware,
], EmployeeManagementController.getEmployeesByBusiness);








// Crear a new employee manager
routerEmployeeManagement.post('/manager/create/:businessId', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.OWNER,
        rolesEnum.ADMIN
    ]),
    verifyAssociatedUserMiddleware,
], EmployeeManagementController.createManagerEmployeeCredentials);


/**
 * MANAGER
 */


/**
 * OWNER
 */


