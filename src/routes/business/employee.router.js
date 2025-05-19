import { Router } from 'express';

import { verifyTokenMiddleware } from '../../middlewares/verifyToken.middleware.js';
import { checkRoleMiddleware } from '../../middlewares/checkRole.middleware.js';
import { verifyAssociatedUserMiddleware } from '../../middlewares/verifyAssociatedUser.middleware.js';

import { EmployeeManagementController } from '../../controllers/business/employeeManagement.controller.js';
import { rolesEnum } from '../../enum/roles.enum.js';

export const routerEmployeeManagement = Router();


routerEmployeeManagement.post('/', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.OWNER,
        rolesEnum.MANAGER,
        rolesEnum.ADMIN
    ]),
    verifyAssociatedUserMiddleware,
], EmployeeManagementController.createEmployeeCredentials);



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
routerEmployeeManagement.post('/manager', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.OWNER,
        rolesEnum.ADMIN
    ]),
    verifyAssociatedUserMiddleware,
], EmployeeManagementController.createManagerEmployeeCredentials);

// Actualizar el estado de un empleado (activar/desactivar)
routerEmployeeManagement.patch('/:employeeId/status', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.OWNER,
        rolesEnum.MANAGER,
        rolesEnum.ADMIN
    ]),
    verifyAssociatedUserMiddleware,
], EmployeeManagementController.updateEmployeeStatus);

// Actualizar la contraseña de un empleado
routerEmployeeManagement.patch('/:employeeId/password', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.OWNER,
        rolesEnum.MANAGER,
        rolesEnum.ADMIN
    ]),
    verifyAssociatedUserMiddleware,
], EmployeeManagementController.updateEmployeePassword);

// Actualizar la información de un empleado
routerEmployeeManagement.patch('/:employeeId', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.OWNER,
        rolesEnum.MANAGER,
        rolesEnum.ADMIN
    ]),
    verifyAssociatedUserMiddleware,
], EmployeeManagementController.updateEmployeeInformation);
