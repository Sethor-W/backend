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
                return sendResponse(res, 400, true, `The following fields are required: ${missingFields.join(", ")}`);
            }

            // Check if the specified branch exists
            const branch = await Branch.findByPk(branchId);
            if (!branch) {
                return sendResponse(res, 404, true, 'Branch not found');
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
                branchId,
                businessId
            });

            // Send a successful response
            return sendResponse(res, 201, false, "Product created successfully", newProduct);
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

            return sendResponse(res, 200, false, 'Products retrieved successfully', products);
        } catch (error) {
            console.error('Error getting products by business:', error);
            return sendResponse(res, 500, true, 'Could not retrieve products');
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
                return sendResponse(res, 404, true, 'Product not found');
            }

            // Convertir la cadena de photos en un array
            if (product.photos) {
                product.photos = product.photos.split(', ').map(photo => photo.trim());
            }

            return sendResponse(res, 200, false, 'Product retrieved successfully', product);
        } catch (error) {
            console.error('Error getting product by ID:', error);
            return sendResponse(res, 500, true, 'Could not retrieve product');
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
                    return sendResponse(res, 404, true, 'Branch not found');
                }
            }

            // Buscar el producto por su ID
            let product = await Product.findByPk(productId);
            if (!product) {
                return sendResponse(res, 404, true, 'Product not found');
            }

            const photosString = Array.isArray(photos) ? photos.join(', ') : product.photos;

            // Actualizar el producto con los nuevos datos
            product = await product.update({ name, category, offer, type, description, photos: photosString, price, profilePicture, branchId });

            return sendResponse(res, 200, false, 'Product updated successfully', product);
        } catch (error) {
            console.error('Error updating product by ID:', error);
            return sendResponse(res, 500, true, 'Could not update product');
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
                return sendResponse(res, 404, true, 'Product not found');
            }

            // Eliminar el producto
            await product.destroy();

            return sendResponse(res, 200, false, 'Product deleted successfully');
        } catch (error) {
            console.error('Error deleting product by ID:', error);
            return sendResponse(res, 500, true, 'Could not delete product');
        }
    }

}