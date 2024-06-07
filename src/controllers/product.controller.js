import { Op } from "sequelize";
import { sendResponse, validateRequiredFields } from "../helpers/utils.js";
import { Branch } from "../models/branch.js";
import { Product } from "../models/product.js";


export class ProductController {

    /**
      * Crear un producto
      */
    // POST business/products/:businessId/branch/:branchId
    static async registerProduct(req, res) {
        const { branchId, businessId } = req.params;
        const { name, category, offer, type, description, photos, price, profilePicture } = req.body;

        try {

            // Validate the presence of required fields
            const requiredFields = ["name", "type", "price", "description", "branchId"];
            const missingFields = validateRequiredFields({ ...req.body, ...req.params }, requiredFields);
            if (missingFields.length > 0) {
                return sendResponse(res, 400, true, `Se requieren los siguientes campos: ${missingFields.join(", ")}`);
            }

            // Check if the specified branch exists
            if (branchId !=='all') {
                const branch = await Branch.findByPk(branchId);
                if (!branch) {
                    return sendResponse(res, 404, true, 'Sucursal no encontrada');
                }
            }

            // Create a new product in the database
            const photosString = Array.isArray(photos) ? photos.join(', ') : '';
            const newProduct = await Product.create({
                name,
                category,
                offer,
                type,
                description,
                photos: photosString,
                price,
                profilePicture,
                branchId: branchId === 'all' ? null : branchId,
                businessId
            });

            // Send a successful response
            return sendResponse(res, 201, false, "Producto creado exitosamente", newProduct);
        } catch (error) {
            console.error("Error al registrar el producto:", error);
            return sendResponse(res, 500, true, "Error al registrar el producto");
        }
    }

    /**
     * Obtener todos los productos de un negocio ordenados por sucursales
     */
    // GET business/products/by-business/:businessId?page=1&type=combo&search=nombredelProducto
    static async getProductsByBusiness(req, res) {
        const { businessId } = req.params;
        const { type, page, search } = req.query;

        try {
            // Configurar la condición de consulta para incluir todas las facturas si no se proporciona un estado
            const whereCondition = {
                businessId,
                ...(type && { type }),
                ...(search && { name: { [Op.like]: `%${search}%` } })
            };

            // Configurar opciones de paginación
            let optionsPagination = {};
            if (page) {
                const pageSize = 15;
                const offset = (page - 1) * pageSize;

                optionsPagination = {
                    limit: pageSize,
                    offset: offset,
                }
            }

            const products = await Product.findAndCountAll({
                where: whereCondition,
                order: [['createdAt', 'DESC']],
                ...optionsPagination
            });

            return sendResponse(res, 200, false, 'Productos recuperados exitosamente', products);
        } catch (error) {
            console.error('Error al obtener productos por empresa:', error);
            return sendResponse(res, 500, true, 'Error al obtener productos por empresa');
        }
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