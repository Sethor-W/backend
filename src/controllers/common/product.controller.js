import { Op } from "sequelize";
import { sendResponse } from "../../helpers/utils.js";
import { Branch } from "../../models/common/branch.js";
import { Product } from "../../models/client/product.js";
import { ProductCommonService } from "../../services/common/product.service.js";


export class ProductCommonController {

   
    /**
     * Obtener todos los productos de un negocio ordenados por sucursales
     */
    // GET business/:businessId/products?page=1&category=&search=El Remate
    static async getProductsByBusiness(req, res) {
        const result = await ProductCommonService.getAllProducts(req.params, req.query, req.locales);
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

}