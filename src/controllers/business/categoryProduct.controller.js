import { sendResponse } from "../../helpers/utils.js";
import { CategoryProductBusinessService } from "../../services/business/categoryProduct.service.js";


export class CategoryProductBusinessController {
    // Crear una nueva categoría de producto
    static async createCategoryProduct(req, res) {
        const locales = req.locales;
        const result = await CategoryProductBusinessService.createCategoryProduct(locales, req.body);
        return sendResponse(res, result.statusCode, result.error, result.message, result.data);
    }

    // Obtener todas las categorías de productos para un negocio
    static async getAllCategoryProducts(req, res) {
        const locales = req.locales;
        const result = await CategoryProductBusinessService.getAllCategoryProducts(locales);
        return sendResponse(res, result.statusCode, result.error, result.message, result.data);
    }

    // Actualizar una categoría de producto
    static async updateCategoryProduct(req, res) {
        const {idCategoryProduct} = req.params;
        const {name} = req.body;
        const result = await CategoryProductBusinessService.updateCategoryProduct({idCategoryProduct, name});
        return sendResponse(res, result.statusCode, result.error, result.message, result.data);
    }

    // Eliminar una categoría de producto
    static async deleteCategoryProductController(req, res) {
        const {idCategoryProduct} = req.params;
        const result = await CategoryProductBusinessService.deleteCategoryProduct({idCategoryProduct});
        return sendResponse(res, result.statusCode, result.error, result.message, result.data);
    }
}
