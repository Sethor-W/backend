import express from 'express';
import cors from 'cors';
import { sequelize } from '../config/database.config.js';

// Helpers
import { sendResponse } from '../helpers/utils.js';

// Models
import '../models/index.js';

// Routes
import { configureRoutes } from '../routes/index.js';
import { configureMiddlewares } from '../middlewares/index.js';


class Server {

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    console.log("Pruerto:", this.port);
    
    configureMiddlewares(this.app);
    configureRoutes(this.app);

    // Direcciones de las rutas
    // this.business = '/business'
    // this.versionAPI = '/api/v1'
    // this.path = {
      
    //   auth: this.versionAPI + '/auth',
    //   profile: this.versionAPI + '/users/profile',
    //   securityAccount: this.versionAPI + '/security',
    //   identityDocuments: this.versionAPI + '/identity-documents',
    //   code: this.versionAPI + '/code',

    //   statistics: this.versionAPI + '/statistics', 

    //   authBusiness: this.versionAPI + this.business + '/auth', 
    //   business: this.versionAPI + this.business + '/', 
    //   branch: this.versionAPI + this.business + '/branches', 
    //   product: this.versionAPI + this.business + '/products', 
    //   employeeManagement: this.versionAPI + this.business + '/employees', 
    //   businessFunction: this.versionAPI + this.business + '/functions', 
    //   profileBusiness: this.versionAPI + this.business + '/users/profile', 
    //   invoice: this.versionAPI + '/invoices', 

    //   storage: this.versionAPI + '/storage',
    //   payment: this.versionAPI + '/payment',
    //   others: this.versionAPI, 
      
    // }
    // 
    // DB
    this.connectionDB();

    // Middlewares
    // this.middlewares();

    // Rutas de la app
    // this.routes();

  }


  connectionDB() {
    // sequelize.sync({ alter: true })
    sequelize.sync()
            .then(() => console.log('Conexión a la base de datos establecida'))
            .catch((err) => console.error('Error al conectar la base de datos:', err));
  }

  // middlewares() {
  //   this.app.use(cors()); // Habilitar CORS
  //   this.app.use(express.json()); // Lectura y parseo del body
  //   this.app.use(express.static('public')); // Directorio público
  // }

  
  // routes() {
  //   // // Rutas para el uso de app
  //   // this.app.use(this.path.auth, routerAuth);
  //   // this.app.use(this.path.securityAccount, routerSecurityAccount);
  //   // this.app.use(this.path.identityDocuments, routerIdentityDocument);
  //   // this.app.use(this.path.code, routerCode);
  //   // this.app.use(this.path.profile, routerProfile);

  //   // this.app.use(this.path.statistics, routerStatistics);
  //   // // Rutas para la app business
  //   // this.app.use(this.path.businessFunction, routerBusinessFunction);
  //   // this.app.use(this.path.authBusiness, routerAuthBusiness);
  //   // this.app.use(this.path.business, routerBusiness);
  //   // this.app.use(this.path.branch, routerBranch);
  //   // this.app.use(this.path.product, routerProduct);
  //   // this.app.use(this.path.employeeManagement, routerEmployeeManagement);
  //   // this.app.use(this.path.invoice, routerInvoice);
  //   // this.app.use(this.path.profileBusiness, routerProfileBusiness);
  //   // // Rutas para Payments
  //   // this.app.use(this.path.payment, routerPayment);
    
  //   // // Otras rutas
  //   // this.app.use(this.path.others, routerOther);
  //   // this.app.use(this.path.storage, routerStorage);

  //   // Usar el router principal
    
    
  //   this.app.use('/api/v1', router);

  //   // Error 404
  //   this.app.use('*', (req, res) => {
  //     sendResponse(res, 400, true, 'Endpoint no encontrado');
  //   });

  // }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en http://localhost:${this.port}`);
    });
  }

}

export default Server;
