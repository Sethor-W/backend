import { Router } from 'express';

// Importar todos los routers
import { routerAuth } from './client/auth.router.js';
import { routerSecurityAccount } from './securityAccount.router.js';
import { routerIdentityDocument } from './identityDocument.router.js';
import { routerCode } from './code.router.js';
import { routerAuthBusiness } from './business/authBusiness.router.js';
import { routerBusiness } from './business.router.js';
import { routerBranch } from './branch.router.js';
import { routerProductCommon } from './common/product.router.js';
import { routerOther } from './other.router.js';
import { routerEmployeeManagement } from './business/employee.router.js';
import { routerBusinessFunction } from './businessFunction.router.js';
import { routerInvoice } from './invoice.router.js';
import { routerProfileBusiness } from './profileBusiness.router.js';
import { routerProfile } from './profile.router.js';
import { routerStatistics } from './statistics.router.js';
import { routerStorage } from './storage.router.js';
import { routerPayment } from './payment.router.js';
import { sendResponse } from '../helpers/utils.js';
import { routerProductBusiness } from './business/productBusiness.router.js';
import { routerReportBusiness } from './business/reportBusiness.router.js';
import { routerCategoryProduct } from './common/categoryProduct.router.js';
import { routerCard } from './cards.router.js';
import { routerSdk } from '../controllers/sdk/sdk.router.js';
import { routerTransbank } from './payment/transbank.route.js';

// Crear el router principal
const router = Router();

//Registrar sdk finger scan
router.use('/sdk',routerSdk);

// Registrar rutas de Transbank
router.use('/payment/transbank', routerTransbank    );


// Registrar las rutas con sus respectivos paths
router.use('/auth', routerAuth);


router.use('/security', routerSecurityAccount);
router.use('/identity-documents', routerIdentityDocument);
router.use('/code', routerCode);
router.use('/cards', routerCard);
router.use('/users/profile', routerProfile);

router.use('/statistics', routerStatistics);

router.use('/business/auth', routerAuthBusiness);

router.use('/business/functions', routerBusinessFunction);
router.use('/business/users/profile', routerProfileBusiness);

router.use('/business/:businessId/branches', (req, res, next) => {
    req.locales = req.locales || {};
    req.locales.businessId = req.params.businessId;
    next();
}, routerBranch);

router.use('/business/:businessId/employees', (req, res, next) => {
    req.locales = req.locales || {};
    req.locales.businessId = req.params.businessId;
    next();
}, routerEmployeeManagement);

router.use('/business/:businessId/products', (req, res, next) => {
    req.locales = req.locales || {};
    req.locales.businessId = req.params.businessId;
    next();
}, routerProductBusiness, routerProductCommon);

router.use('/business/:businessId/reports', (req, res, next) => {
    req.locales = req.locales || {};
    req.locales.businessId = req.params.businessId;
    next();
}, routerReportBusiness);

router.use('/business/:businessId/category-product', (req, res, next) => {
    req.locales = req.locales || {};
    req.locales.businessId = req.params.businessId;
    console.log(req.params.idCategoryProduct)
    console.log(req.locales.businessId)
    next();
}, routerCategoryProduct);

router.use('/business', routerBusiness);


router.use('/invoices', routerInvoice);

router.use('/storage', routerStorage);
router.use('/payment', routerPayment);

router.use('/', routerOther);



export const configureRoutes = (app) => {
    app.use('/api/v1', router);

    // Error 404
    app.use('*', (req, res) => {
        sendResponse(res, 404, true, 'Endpoint no encontrado');
    });
};

// export default router;
