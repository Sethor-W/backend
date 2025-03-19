import { Router } from "express";

import { SdkController } from "./sdk.controller.js";

const routerSdk = Router();

//CAPTURADOR DE HUELLAS
routerSdk.use('/capture',SdkController.validateFingerprint);
routerSdk.use('/template',SdkController.validateTemplate)

export {routerSdk}