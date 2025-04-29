import { sendResponse } from "../../helpers/utils.js";
import { CategoryProductBusinessService } from "../../services/business/categoryProduct.service.js";


export class CategoryProductBusinessController {
    /**
     * @swagger
     * /api/v1/business/category-products:
     *   post:
     *     summary: Create a new product category
     *     tags: [Product Categories]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *               - businessId
     *             properties:
     *               name:
     *                 type: string
     *                 description: Name of the product category
     *               businessId:
     *                 type: string
     *                 description: ID of the business
     *     responses:
     *       201:
     *         description: Product category created successfully
     *       400:
     *         description: Missing required fields or validation error
     *       500:
     *         description: Server error
     */
    // Crear una nueva categoría de producto
    static async createCategoryProduct(req, res) {
        const locales = req.locales;
        const result = await CategoryProductBusinessService.createCategoryProduct(locales, req.body);
        return sendResponse(res, result.statusCode, result.error, result.message, result.data);
    }

    /**
     * @swagger
     * /api/v1/business/category-products:
     *   get:
     *     summary: Get all product categories for a business
     *     tags: [Product Categories]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Product categories retrieved successfully
     *       404:
     *         description: No product categories found
     *       500:
     *         description: Server error
     */
    // Obtener todas las categorías de productos para un negocio
    static async getAllCategoryProducts(req, res) {
        const locales = req.locales;
        const result = await CategoryProductBusinessService.getAllCategoryProducts(locales);
        return sendResponse(res, result.statusCode, result.error, result.message, result.data);
    }

    /**
     * @swagger
     * /api/v1/business/category-products/{idCategoryProduct}:
     *   put:
     *     summary: Update a product category
     *     tags: [Product Categories]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: idCategoryProduct
     *         required: true
     *         schema:
     *           type: string
     *         description: ID of the product category to update
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *             properties:
     *               name:
     *                 type: string
     *                 description: New name for the product category
     *     responses:
     *       200:
     *         description: Product category updated successfully
     *       404:
     *         description: Product category not found
     *       500:
     *         description: Server error
     */
    // Actualizar una categoría de producto
    static async updateCategoryProduct(req, res) {
        const {idCategoryProduct} = req.params;
        const {name} = req.body;
        const result = await CategoryProductBusinessService.updateCategoryProduct({idCategoryProduct, name});
        return sendResponse(res, result.statusCode, result.error, result.message, result.data);
    }

    /**
     * @swagger
     * /api/v1/business/category-products/{idCategoryProduct}:
     *   delete:
     *     summary: Delete a product category
     *     tags: [Product Categories]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: idCategoryProduct
     *         required: true
     *         schema:
     *           type: string
     *         description: ID of the product category to delete
     *     responses:
     *       200:
     *         description: Product category deleted successfully
     *       404:
     *         description: Product category not found
     *       500:
     *         description: Server error
     */
    // Eliminar una categoría de producto
    static async deleteCategoryProductController(req, res) {
        const {idCategoryProduct} = req.params;
        const result = await CategoryProductBusinessService.deleteCategoryProduct({idCategoryProduct});
        return sendResponse(res, result.statusCode, result.error, result.message, result.data);
    }
}
