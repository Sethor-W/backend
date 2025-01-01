import { Op } from "sequelize";
import { sendResponse } from "../../helpers/utils.js";
import { Branch } from "../../models/common/branch.js";
import { Product } from "../../models/client/product.js";
import { ProductBusinessService } from "../../services/business/product.service.js";


export class ProductBusinessController {

    /**
     * Crear un producto
     */
    // POST business/products/:businessId/branch/:branchId
    static async registerProduct(req, res) {
        const result = await ProductBusinessService.createProduct(req.params, req.body, req.locales);
        return sendResponse(res, result.statusCode, result.error, result.message, result.data);
    }

    /**
     * Obtener todos los productos de un negocio ordenados por sucursales
     */
    // GET business/products/by-business/:businessId?page=1&type=combo&search=nombredelProducto
    static async getProductsByBusiness(req, res) {
        const result = await ProductBusinessService.getAllProducts(req.params, req.query, req.locales);
        return sendResponse(res, result.statusCode, result.error, result.message, result.data);
    }

    /**
     * Obtener todos los productos de un negocio ordenados por sucursales
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

    /**
     * Actualizar un producto por su ID
     */
    // PUT business/products/by-id/:businessId/:productId
    static async updateProduct(req, res) {
        const { productId } = req.params;
        const { name, category, offer, type, description, photos, price, profilePicture, branchId } = req.body;
        try {


            if (branchId) {
                // Check if the specified branch exists
                const branch = await Branch.findByPk(branchId);
                if (!branch) {
                    return sendResponse(res, 404, true, 'Sucursal no encontrado');
                }
            }

            // Buscar el producto por su ID
            let product = await Product.findByPk(productId);
            if (!product) {
                return sendResponse(res, 404, true, 'Producto no encontrado');
            }

            const photosString = Array.isArray(photos) ? photos.join(', ') : product.photos;

            // Actualizar el producto con los nuevos datos
            product = await product.update({ name, category, offer, type, description, photos: photosString, price, profilePicture, branchId });

            return sendResponse(res, 200, false, 'Producto actualizado exitosamente', product);
        } catch (error) {
            console.error('Error al actualizar el producto por ID:', error);
            return sendResponse(res, 500, true, 'No se pudo actualizar el producto');
        }
    }

    /**
     * Eliminar un producto por su ID
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