import { Router } from "express";

import { BusinessFunctionController } from "../controllers/businessFunction.controller.js";

import { verifyTokenMiddleware } from "../middlewares/verifyToken.middleware.js";

export const routerBusinessFunction = Router();

routerBusinessFunction.get("/",[
    verifyTokenMiddleware,
  ], BusinessFunctionController.getBusinessFunction);
