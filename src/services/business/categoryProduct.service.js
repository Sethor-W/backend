// src/services/auth.service.js
import { ProfileService } from "./profile.service.js";
import { BranchService } from "./branch.service.js";
import { CurrencyService } from "../common/currency.service.js";
import { discountTypeEnum } from "../../enum/discountType.enum.js";
import { Invoice } from "../../models/common/invoice.js";
import { invoiceStatusEnum } from "../../enum/invoiceStatus.enum.js";
import { Business } from "../../models/common/business.js";
import { UserBusiness } from "../../models/business/usersBusiness.js";
import { User } from "../../models/client/users.js";
import { Profile } from "../../models/client/profile.js";
import { ProfileBusiness } from "../../models/business/profileBusiness.js";
import { Op } from "sequelize";
import { Branch } from "../../models/common/branch.js";
import { Product } from "../../models/client/product.js";
import { CategoryProduct } from "../../models/common/categoryProduct.js";

export class CategoryProductBusinessService {



    // Crear una nueva categoría de producto
    static async createCategoryProduct(locales, body) {
        const {businessId} = locales;
        const {name} = body;

        try {
            const categoryProduct = await CategoryProduct.create({
                businessId,
                name,
            });

            return {
                error: false,
                statusCode: 200,
                message: "Category created successfully",
                data: categoryProduct,
            }
        } catch (error) {
            console.error("Error al crear la categoría de producto:", error);
            return {
                error: true,
                statusCode: 500,
                message: "Error al crear la categoría de producto",
            };
        }
    }

    // Obtener todas las categorías de productos para un negocio
    static async getAllCategoryProducts(locales) {
        const {businessId} = locales;

        try {
            const categories = await CategoryProduct.findAll({
                where: { businessId },
            });
            return {
                error: false,
                statusCode: 200,
                message: "Categories retrieved successfully",
                data: categories,
            }
        } catch (error) {
            console.error("Error al obtener las categorías de productos:", error);
            return {
                error: true,
                statusCode: 500,
                message: "Error al obtener las categorías de productos",
            };
        }
    }

    // Actualizar una categoría de producto
    static async updateCategoryProduct({idCategoryProduct, name}) {
        const id = idCategoryProduct;
        console.log(idCategoryProduct)
        try {
            const category = await CategoryProduct.findByPk(idCategoryProduct);
            if (!category) {
                return {
                    error: true,
                    statusCode: 404,
                    message: "Categoría de producto no encontrada",
                }

            }
                

            category.name = name;
            await category.save();

            return {
                error: false,
                statusCode: 200,
                message: "Category updated successfully",
                data: category,
            }
        } catch (error) {
            console.error("Error al actualizar la categoría de producto:", error);
            return {
                error: true,
                statusCode: 500,
                message: "Error al actualizar la categoría de producto",
            };
        }
    }

    // Eliminar una categoría de producto
    static async deleteCategoryProduct({idCategoryProduct}) {
        const id = idCategoryProduct;
        try {
            const category = await CategoryProduct.findByPk(id);
            if (!category) {
                return {
                    error: true,
                    statusCode: 404,
                    message: "Categoría de producto no encontrada",
                };
            }

            await category.destroy();
            return {
                error: false,
                statusCode: 200,
                message: "Categoría de producto eliminada con éxito",
            }
        } catch (error) {
            console.error("Error al eliminar la categoría de producto:", error);
            return {
                error: true,
                statusCode: 500,
                message: "Error al eliminar la categoría de producto",
            };
        }
    }

}
