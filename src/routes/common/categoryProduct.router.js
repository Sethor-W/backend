import { Router } from 'express';

import {verifyTokenMiddleware} from '../../middlewares/verifyToken.middleware.js'
import { checkRoleMiddleware } from '../../middlewares/checkRole.middleware.js';
import { verifyAssociatedUserMiddleware } from '../../middlewares/verifyAssociatedUser.middleware.js';

import { rolesEnum } from '../../enum/roles.enum.js';
import { ReportBusinessController } from '../../controllers/business/report.controller.js';
import { CategoryProductBusinessController } from '../../controllers/business/categoryProduct.controller.js';

export const routerCategoryProduct = Router();

// Crear categoria
routerCategoryProduct.post('/', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.OWNER,
        rolesEnum.MANAGER,
        rolesEnum.ADMIN
    ]),
    verifyAssociatedUserMiddleware,
], CategoryProductBusinessController.createCategoryProduct);

// Obtener todas las categorias
routerCategoryProduct.get('/', [
    verifyTokenMiddleware,
], CategoryProductBusinessController.getAllCategoryProducts);

// Actualizar una categoría de producto
routerCategoryProduct.put('/:idCategoryProduct', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.OWNER,
        rolesEnum.MANAGER,
        rolesEnum.ADMIN
    ]),
    verifyAssociatedUserMiddleware,
], CategoryProductBusinessController.updateCategoryProduct);


routerCategoryProduct.delete('/:idCategoryProduct', [
    verifyTokenMiddleware,
    checkRoleMiddleware([
        rolesEnum.OWNER,
        rolesEnum.MANAGER,
        rolesEnum.ADMIN
    ]),
    verifyAssociatedUserMiddleware,
], CategoryProductBusinessController.deleteCategoryProductController);


// routerCategoryProduct.post("/", CategoryProductBusinessController.createCategoryProductController);

// Obtener todas las categorías de productos para un negocio
// routerCategoryProduct.get("/:businessId", CategoryProductBusinessController.getAllCategoryProductsController);

// Actualizar una categoría de producto
// routerCategoryProduct.put("/:id", CategoryProductBusinessController.updateCategoryProductController);

// Eliminar una categoría de producto
// routerCategoryProduct.delete("/:id", CategoryProductBusinessController.deleteCategoryProductController);

