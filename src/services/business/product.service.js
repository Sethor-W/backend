// src/services/auth.service.js
import {
    ProfileService
} from "./profile.service.js";
import {
    BranchService
} from "./branch.service.js";
import {
    CurrencyService
} from "../common/currency.service.js";
import {
    discountTypeEnum
} from "../../enum/discountType.enum.js";
import {
    Invoice
} from "../../models/common/invoice.js";
import {
    invoiceStatusEnum
} from "../../enum/invoiceStatus.enum.js";
import {
    Business
} from "../../models/common/business.js";
import {
    UserBusiness
} from "../../models/business/usersBusiness.js";
import {
    User
} from "../../models/client/users.js";
import {
    Profile
} from "../../models/client/profile.js";
import {
    ProfileBusiness
} from "../../models/business/profileBusiness.js";
import {
    Op
} from "sequelize";
import {
    Branch
} from "../../models/common/branch.js";
import {
    Product
} from "../../models/client/product.js";

export class ProductBusinessService {


    static async createProduct(params, body, locales) {
        const {
            businessId
        } = locales;
        const {
            photos,
            profilePicture,
            name,
            description,
            price,
            discountType,
            discountValue,
            category,
            branchId,
            offer,
            type
        } = body;

        try {
            // Check if the specified branch exists
            if (branchId !== 'all') {
                const branch = await Branch.findByPk(branchId);
                if (!branch) {
                    return {
                        error: true,
                        statusCode: 404,
                        message: "Sucursal no encontrada",
                    }
                }
            }

            // Validate discount type if provided
            if (discountType && !Object.values(discountTypeEnum).includes(discountType)) {
                return {
                    error: true,
                    statusCode: 400,
                    message: "Tipo de descuento no válido: fixed o percentage",
                }
            }

            // Create a new product in the database
            const newProduct = await Product.create({
                photos: Array.isArray(photos) ? photos.join(', ') : '',
                profilePicture,
                name,
                description,
                price,
                discountType: discountType || discountTypeEnum.FIXED,
                discountValue: discountValue || 0,
                category,

                businessId,
                branchId: branchId === 'all' ? null : branchId,

                // offer,
                // type,
            });

            // Respuesta exitosa
            return {
                error: false,
                statusCode: 201,
                message: "Producto creado exitosamente",
                data: newProduct,
            };

        } catch (error) {
            console.error("Error al enviar:", error);
            return {
                error: true,
                statusCode: 500,
                message: "Error al registrar el producto",
            };
        }
    }


    static async updateProduct(params, body, locales) {
        const { businessId } = locales;
        const { productId } = params;
        const { photos, profilePicture, name, description, price, discountType, discountValue, category, branchId, offer, type } = body;

        try {

            // Check if the specified branch exists
            if (branchId && branchId !== 'all') {
                const branch = await Branch.findByPk(branchId);
                if (!branch) {
                    return {
                        error: true,
                        statusCode: 404,
                        message: "Sucursal no encontrada",
                    }
                }
            }

            let product = await Product.findByPk(productId);
            if (!product) {
                return {
                    error: true,
                    statusCode: 404,
                    message: "Producto no encontrada",
                }
            }

            // Actualizar el producto con los nuevos datos
            product = await product.update({
                photos: Array.isArray(photos) ? photos.join(', ') : product.photos,
                profilePicture,
                name,
                description,
                price,
                discountType: discountType || discountTypeEnum.FIXED,
                discountValue: discountValue,
                category,
                branchId: branchId === 'all' ? null : branchId,

                // offer,
                // type,
            });

            // Respuesta exitosa
            return {
                error: false,
                statusCode: 200,
                message: "Producto actualizado exitosamente",
                data: product,
            };

        } catch (error) {
            console.error("Error al actualizar el producto:", error);
            return {
                error: true,
                statusCode: 500,
                message: "Error al actualizar el producto",
            };
        }
    }

}