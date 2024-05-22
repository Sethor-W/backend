import express from 'express';
import cors from 'cors';
import { sequelize } from '../config/database.config.js';

// Helpers
import { sendResponse } from '../helpers/utils.js';

// Models
import '../models/users.js'
import '../models/identityDocuments.js'
import '../models/profile.js'
import '../models/code.js'
import '../models/usersBusiness.js'
import '../models/profileBusiness.js'
import '../models/userBusinessRoles.js'
import '../models/employeesAssocitedBusiness.js'
import '../models/business.js'
import '../models/branch.js'
import '../models/product.js'
import '../models/help.js'
import '../models/opinionOrSuggestion.js'
import '../models/representativeSethor.js'
import '../models/businessFunction.js'
import '../models/assignedUserFunction.js'
import '../models/invoice.js'
import '../models/soldProductStatistic.js'
import '../models/buyingUserStatistic.js'
import '../models/earningsStatistic.js'

// Routes
import { routerAuth } from '../routes/auth.router.js';
import { routerSecurityAccount } from '../routes/securityAccount.router.js';
import { routerIdentityDocument } from '../routes/identityDocument.router.js';
import { routerCode } from '../routes/code.router.js';
import { routerAuthBusiness } from '../routes/authBusiness.router.js';
import { routerBusiness } from '../routes/business.router.js';
import { routerBranch } from '../routes/branch.router.js';
import { routerProduct } from '../routes/product.router.js';
import { routerOther } from '../routes/other.router.js';
import { routerEmployeeManagement } from '../routes/employee.router.js';
import { routerBusinessFunction } from '../routes/businessFunction.router.js';
import { routerInvoice } from '../routes/invoice.router.js';
import { routerProfileBusiness } from '../routes/profileBusiness.router.js';
import { routerProfile } from '../routes/profile.router.js';
import { routerStatistics } from '../routes/statistics.router.js';




class Server {

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 8080;

    // Direcciones de las rutas
    this.business = '/business'
    this.versionAPI = '/api/v1'
    this.path = {
      auth: this.versionAPI + '/auth',
      profile: this.versionAPI + '/users/profile',
      securityAccount: this.versionAPI + '/security',
      identityDocuments: this.versionAPI + '/identity-documents',
      code: this.versionAPI + '/code',

      statistics: this.versionAPI + '/statistics', 

      authBusiness: this.versionAPI + this.business + '/auth', 
      business: this.versionAPI + this.business + '/', 
      branch: this.versionAPI + this.business + '/branches', 
      product: this.versionAPI + this.business + '/products', 
      employeeManagement: this.versionAPI + this.business + '/employees', 
      businessFunction: this.versionAPI + this.business + '/functions', 
      profileBusiness: this.versionAPI + this.business + '/users/profile', 
      invoice: this.versionAPI + '/invoices', 

      others: this.versionAPI, 
    }
    
    // DB
    this.connectionDB();

    // Middlewares
    this.middlewares();

    // Rutas de la app
    this.routes();

  }

  routes() {
    // Rutas para el uso de app
    this.app.use(this.path.auth, routerAuth);
    this.app.use(this.path.securityAccount, routerSecurityAccount);
    this.app.use(this.path.identityDocuments, routerIdentityDocument);
    this.app.use(this.path.code, routerCode);
    this.app.use(this.path.profile, routerProfile);

    this.app.use(this.path.statistics, routerStatistics);
    
    // Rutas para la app business
    this.app.use(this.path.businessFunction, routerBusinessFunction);
    this.app.use(this.path.authBusiness, routerAuthBusiness);
    this.app.use(this.path.business, routerBusiness);
    this.app.use(this.path.branch, routerBranch);
    this.app.use(this.path.product, routerProduct);
    this.app.use(this.path.employeeManagement, routerEmployeeManagement);
    this.app.use(this.path.invoice, routerInvoice);
    this.app.use(this.path.profileBusiness, routerProfileBusiness);
    
    // Otras rutas
    this.app.use(this.path.others, routerOther);
    

    // Error 404
    this.app.use('*', (req, res) => {
      sendResponse(res, 400, true, 'Endpoint no encontrado');
    });

  }

  connectionDB() {
    // sequelize.sync({ alter: true });
    sequelize.sync();
  }

  middlewares() {
    // CORS
    this.app.use(
      cors()
    );

    // Lectura y parseo del body
    this.app.use(express.json());

    // Directorio público
    this.app.use(express.static('public'));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en http://localhost:${this.port}`);
    });
  }

}

export default Server;
