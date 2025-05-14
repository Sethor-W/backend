import { Op } from "sequelize";
import { sendResponse } from "../../helpers/utils.js";
import { Branch } from "../../models/common/branch.js";
import { Product } from "../../models/client/product.js";
import { ProductBusinessService } from "../../services/business/product.service.js";


export class ProductBusinessController {

    /**
     * @swagger
     * /api/v1/business/{businessId}/products:
     *   post:
     *     summary: Create a new product
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
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *               - price
     *               - description
     *               - profilePicture
     *             properties:
     *               name:
     *                 type: string
     *                 description: Product name
     *               description:
     *                 type: string
     *                 description: Product description
     *               price:
     *                 type: number
     *                 description: Product price
     *               profilePicture:
     *                 type: string
     *                 description: URL to product profile picture
     *               photos:
     *                 type: array
     *                 items:
     *                   type: string
     *                 description: Array of photo URLs
     *               discountType:
     *                 type: string
     *                 enum: [fixed, percentage]
     *                 description: Type of discount (fixed or percentage)
     *               discountValue:
     *                 type: number
     *                 description: Value of the discount
     *               category:
     *                 type: string
     *                 description: Product category
     *               branchId:
     *                 type: string
     *                 description: ID of the branch or 'all' for all branches
     *               offer:
     *                 type: boolean
     *                 description: Whether the product is on offer
     *               type:
     *                 type: string
     *                 enum: [individual, combo, offer]
     *                 description: Product type
     *     responses:
     *       201:
     *         description: Product created successfully
     *       400:
     *         description: Missing required fields or invalid discount type
     *       404:
     *         description: Branch not found
     *       500:
     *         description: Server error
     */
    // POST business/:businessId/products
    static async registerProduct(req, res) {
        const result = await ProductBusinessService.createProduct(req.params, req.body, req.locales);
        return sendResponse(res, result.statusCode, result.error, result.message, result.data);
    }

    /**
     * @swagger
     * /api/v1/business/{businessId}/products/{productId}:
     *   put:
     *     summary: Update a product
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
     *       - in: path
     *         name: productId
     *         required: true
     *         schema:
     *           type: string
     *         description: ID of the product
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 description: Product name
     *               description:
     *                 type: string
     *                 description: Product description
     *               price:
     *                 type: number
     *                 description: Product price
     *               profilePicture:
     *                 type: string
     *                 description: URL to product profile picture
     *               photos:
     *                 type: array
     *                 items:
     *                   type: string
     *                 description: Array of photo URLs
     *               discountType:
     *                 type: string
     *                 enum: [fixed, percentage]
     *                 description: Type of discount (fixed or percentage)
     *               discountValue:
     *                 type: number
     *                 description: Value of the discount
     *               category:
     *                 type: string
     *                 description: Product category
     *               branchId:
     *                 type: string
     *                 description: ID of the branch or 'all' for all branches
     *               offer:
     *                 type: boolean
     *                 description: Whether the product is on offer
     *               type:
     *                 type: string
     *                 enum: [individual, combo, offer]
     *                 description: Product type
     *     responses:
     *       200:
     *         description: Product updated successfully
     *       404:
     *         description: Product or branch not found
     *       500:
     *         description: Server error
     */
    // PUT business/:businessId/products/:productId
    static async updateProduct(req, res) {
        const result = await ProductBusinessService.updateProduct(req.params, req.body, req.locales);
        return sendResponse(res, result.statusCode, result.error, result.message, result.data);
    }



    /**
     * @swagger
     * /api/v1/business/{businessId}/products/{productId}:
     *   delete:
     *     summary: Delete a product
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
     *       - in: path
     *         name: productId
     *         required: true
     *         schema:
     *           type: string
     *         description: ID of the product to delete
     *     responses:
     *       200:
     *         description: Product deleted successfully
     *       404:
     *         description: Product not found
     *       500:
     *         description: Server error
     */
    // DELETE business/:businessId/products/:productId
    static async deleteProduct(req, res) {
        const { productId } = req.params;
        try {
            // Buscar el producto por su ID
            const product = await Product.findByPk(productId);

            // Verificar si se encontró el producto
            if (!product) {
                return sendResponse(res, 404, true, 'Producto no encontrado');
            }

            // Eliminar el producto
            await product.destroy();

            return sendResponse(res, 200, false, 'Producto eliminado exitosamente');
        } catch (error) {
            console.error('Error al eliminar producto por ID:', error);
            return sendResponse(res, 500, true, 'No se pudo eliminar el producto');
        }
    }

}