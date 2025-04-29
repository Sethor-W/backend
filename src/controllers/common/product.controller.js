import { Op } from "sequelize";
import { sendResponse } from "../../helpers/utils.js";
import { Branch } from "../../models/common/branch.js";
import { Product } from "../../models/client/product.js";
import { ProductCommonService } from "../../services/common/product.service.js";


export class ProductCommonController {

   
    /**
     * @swagger
     * /api/v1/business/{businessId}/products:
     *   get:
     *     summary: Get all products of a business organized by branches
     *     tags: [Products]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: businessId
     *         required: true
     *         schema:
     *           type: string
     *         description: ID of the business
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *         description: Page number for pagination
     *       - in: query
     *         name: category
     *         schema:
     *           type: string
     *         description: Filter products by category
     *       - in: query
     *         name: search
     *         schema:
     *           type: string
     *         description: Search term to filter products
     *     responses:
     *       200:
     *         description: Products retrieved successfully
     *       404:
     *         description: No products found
     *       500:
     *         description: Server error
     */
    // GET business/:businessId/products?page=1&category=&search=El Remate
    static async getProductsByBusiness(req, res) {
        const result = await ProductCommonService.getAllProducts(req.params, req.query, req.locales);
        return sendResponse(res, result.statusCode, result.error, result.message, result.data);
    }

    /**
     * @swagger
     * /api/v1/business/products/by-id/{productId}:
     *   get:
     *     summary: Get product details by ID
     *     tags: [Products]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: productId
     *         required: true
     *         schema:
     *           type: string
     *         description: ID of the product
     *     responses:
     *       200:
     *         description: Product retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: boolean
     *                   example: false
     *                 message:
     *                   type: string
     *                   example: Producto recuperado exitosamente
     *                 data:
     *                   type: object
     *       404:
     *         description: Product not found
     *       500:
     *         description: Server error
     */
    // GET business/products/by-id/:productId
    static async getProductById(req, res) {
        const { productId } = req.params;
        try {
            // Buscar el producto por su ID
            const product = await Product.findByPk(productId);

            // Verificar si se encontró el producto
            if (!product) {
                return sendResponse(res, 404, true, 'Producto no encontrado');
            }

            // Convertir la cadena de photos en un array
            if (product.photos) {
                product.photos = product.photos.split(', ').map(photo => photo.trim());
            }

            return sendResponse(res, 200, false, 'Producto recuperado exitosamente', product);
        } catch (error) {
            console.error('Error al obtener el producto por ID:', error);
            return sendResponse(res, 500, true, 'No se pudo recuperar el producto');
        }
    }

}