import { Router } from 'express';

import {verifyTokenMiddleware} from '../middlewares/verifyToken.middleware.js'
import { checkRoleMiddleware } from '../middlewares/checkRole.middleware.js';
import { verifyAssociatedUserMiddleware } from '../middlewares/verifyAssociatedUser.middleware.js';

import { InvoiceController } from '../controllers/invoice.controller.js';
import { rolesEnum } from '../enum/roles.enum.js';
import { InvoiceBusinessController } from '../controllers/business/invoice.controller.js';

export const routerInvoice = Router();

/** *********************************************************************************
 * CLIENTS
 **********************************************************************************/
routerInvoice.get('/client/getAll', [
    verifyTokenMiddleware,
], InvoiceController.getAllInvoicesByClient);

routerInvoice.get('/client/details/:invoiceId', [
    verifyTokenMiddleware,
], InvoiceController.getInvoiceDetailsByClient);


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

routerInvoice.put('/:businessId/collector/update/:invoiceId', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.COLLECTOR,
    ]),
    verifyAssociatedUserMiddleware,
], InvoiceController.updateInvoiceByCollector);

routerInvoice.post('/:businessId/collector/pay/:invoiceId', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.COLLECTOR,
    ]),
    verifyAssociatedUserMiddleware,
], InvoiceController.payInvoiceByCollector);



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


