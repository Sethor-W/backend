import { Router } from "express";

import { SdkController } from "./sdk.controller.js";

const routerSdk = Router();

//CAPTURADOR DE HUELLAS
routerSdk.use('/capture',SdkController.validateFinger);
routerSdk.use('/template',SdkController.validateTemplate)
routerSdk.use('/capture-one',SdkController.validateOneFinger)

export {routerSdk}