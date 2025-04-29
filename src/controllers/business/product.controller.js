import { Op } from "sequelize";
import { sendResponse } from "../../helpers/utils.js";
import { Branch } from "../../models/common/branch.js";
import { Product } from "../../models/client/product.js";
import { ProductBusinessService } from "../../services/business/product.service.js";


export class ProductBusinessController {

    /**
     * @swagger
     * /api/v1/business/products/{businessId}/branch/{branchId}:
     *   post:
     *     summary: Create a new product
     *     tags: [Business Products]
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
     *         name: branchId
     *         required: true
     *         schema:
     *           type: string
     *         description: ID of the branch or 'all' for all branches
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *               - type
     *               - price
     *               - description
     *             properties:
     *               name:
     *                 type: string
     *                 description: Product name
     *               category:
     *                 type: string
     *                 description: Product category
     *               offer:
     *                 type: boolean
     *                 description: Whether the product is on offer
     *               type:
     *                 type: string
     *                 description: Product type
     *               description:
     *                 type: string
     *                 description: Product description
     *               photos:
     *                 type: array
     *                 items:
     *                   type: string
     *                 description: Array of photo URLs
     *               price:
     *                 type: number
     *                 description: Product price
     *               profilePicture:
     *                 type: string
     *                 description: URL to product profile picture
     *     responses:
     *       201:
     *         description: Product created successfully
     *       400:
     *         description: Missing required fields
     *       404:
     *         description: Branch not found
     *       500:
     *         description: Server error
     */
    // POST business/products/:businessId/branch/:branchId
    static async registerProduct(req, res) {
        const result = await ProductBusinessService.createProduct(req.params, req.body, req.locales);
        return sendResponse(res, result.statusCode, result.error, result.message, result.data);
    }

    /**
     * @swagger
     * /api/v1/business/products/by-id/{businessId}/{productId}:
     *   put:
     *     summary: Update a product
     *     tags: [Business Products]
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
     *               category:
     *                 type: string
     *                 description: Product category
     *               offer:
     *                 type: boolean
     *                 description: Whether the product is on offer
     *               type:
     *                 type: string
     *                 description: Product type
     *               description:
     *                 type: string
     *                 description: Product description
     *               photos:
     *                 type: array
     *                 items:
     *                   type: string
     *                 description: Array of photo URLs
     *               price:
     *                 type: number
     *                 description: Product price
     *               profilePicture:
     *                 type: string
     *                 description: URL to product profile picture
     *               branchId:
     *                 type: string
     *                 description: ID of the branch
     *     responses:
     *       200:
     *         description: Product updated successfully
     *       404:
     *         description: Product or branch not found
     *       500:
     *         description: Server error
     */
    // PUT business/products/by-id/:businessId/:productId
    static async updateProduct(req, res) {
        const result = await ProductBusinessService.updateProduct(req.params, req.body, req.locales);
        return sendResponse(res, result.statusCode, result.error, result.message, result.data);

        // try {


        //     if (branchId) {
        //         // Check if the specified branch exists
        //         const branch = await Branch.findByPk(branchId);
        //         if (!branch) {
        //             return sendResponse(res, 404, true, 'Sucursal no encontrado');
        //         }
        //     }

        //     // Buscar el producto por su ID
        //     let product = await Product.findByPk(productId);
        //     if (!product) {
        //         return sendResponse(res, 404, true, 'Producto no encontrado');
        //     }

        //     const photosString = Array.isArray(photos) ? photos.join(', ') : product.photos;

        //     // Actualizar el producto con los nuevos datos
        //     product = await product.update({ name, category, offer, type, description, photos: photosString, price, profilePicture, branchId });

        //     return sendResponse(res, 200, false, 'Producto actualizado exitosamente', product);
        // } catch (error) {
        //     console.error('Error al actualizar el producto por ID:', error);
        //     return sendResponse(res, 500, true, 'No se pudo actualizar el producto');
        // }
    }

    /**
     * @swagger
     * /api/v1/business/products/by-id/{businessId}/{productId}:
     *   delete:
     *     summary: Delete a product
     *     tags: [Business Products]
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
    // DELETE business/products/by-id/:businessId/:productId
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