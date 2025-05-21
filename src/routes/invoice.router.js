import { Router } from 'express';

import {verifyTokenMiddleware} from '../middlewares/verifyToken.middleware.js'
import { checkRoleMiddleware } from '../middlewares/checkRole.middleware.js';
import { verifyAssociatedUserMiddleware } from '../middlewares/verifyAssociatedUser.middleware.js';

import { InvoiceController } from '../controllers/invoice.controller.js';
import { rolesEnum } from '../enum/roles.enum.js';
import { InvoiceBusinessController } from '../controllers/business/invoice.controller.js';
import { InvoiceClientController } from '../controllers/client/invoice.controller.js';

export const routerInvoice = Router();

/** *********************************************************************************
 * CLIENTS
 **********************************************************************************/
routerInvoice.get('/client', [
    verifyTokenMiddleware,
], InvoiceClientController.getAllInvoices);

routerInvoice.get('/client/:invoiceId', [
    verifyTokenMiddleware,
], InvoiceClientController.getInvoiceDetails);


/** *********************************************************************************
 * MANGERS and OWNERS
 **********************************************************************************/
routerInvoice.get('/:businessId/getAll', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.MANAGER,
        rolesEnum.OWNER,
        rolesEnum.ADMIN,
    ]),
    verifyAssociatedUserMiddleware,
], InvoiceBusinessController.getAllInvoices);

routerInvoice.get('/:businessId/details/:invoiceId', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.MANAGER,
        rolesEnum.OWNER,
        rolesEnum.ADMIN,
    ]),
    verifyAssociatedUserMiddleware,
], InvoiceBusinessController.getInvoiceDetails);

routerInvoice.post('/:businessId/updateStatusToPaid/:invoiceId', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.MANAGER,
        rolesEnum.OWNER,
        rolesEnum.ADMIN,
        rolesEnum.COLLECTOR
    ]),
    verifyAssociatedUserMiddleware,
], InvoiceBusinessController.updateInvoiceStatusToPaid);


/** *********************************************************************************
 * COLLECTOR
 **********************************************************************************/
routerInvoice.post('/:businessId/create', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.COLLECTOR,
    ]),
    verifyAssociatedUserMiddleware,
], InvoiceBusinessController.createInvoice);


routerInvoice.put('/:businessId/collector/update/:invoiceId', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.COLLECTOR,
        rolesEnum.OWNER,
        rolesEnum.ADMIN,
    ]),
    verifyAssociatedUserMiddleware,
], InvoiceBusinessController.updateInvoice);








routerInvoice.get('/:businessId/collector/getAll', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.COLLECTOR,
    ]),
    verifyAssociatedUserMiddleware,
], InvoiceController.getAllInvoicesByCollector);

routerInvoice.get('/:businessId/collector/details/:invoiceId', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.COLLECTOR,
    ]),
    verifyAssociatedUserMiddleware,
], InvoiceController.getInvoiceDetailsByCollector);


routerInvoice.post('/:businessId/collector/pay/:invoiceId', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.COLLECTOR,
    ]),
    verifyAssociatedUserMiddleware,
], InvoiceController.payInvoiceByCollector);




