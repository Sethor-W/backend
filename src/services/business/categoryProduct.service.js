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











    static async createProduct(params, body, locales) {
        const { businessId } = locales;
        const { photos, profilePicture, name, description, price, discountType, discountValue, category, branchId, offer, type } = body;

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


            // Create a new product in the database
            const newProduct = await Product.create({
                photos: Array.isArray(photos) ? photos.join(', ') : '',
                profilePicture,
                name,
                description,
                price,
                discountType: discountType || discountTypeEnum.FIXED,
                discountValue: discountValue,
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
                message: "Factura creada exitosamente",
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


    static async getAllProducts(params, query, locales) {
        const { businessId } = locales;
        let { type, page, search, branchId, category } = query;

        try {
            page = parseInt(page, 10) || 1;  // Si `page` no es válido, asignar 1 como valor predeterminado
            const pageSize = 15;
            const offset = (page - 1) * pageSize;

            // Configurar la condición de consulta para incluir todas las facturas si no se proporciona un estado
            const whereCondition = { businessId };
            
            if (type) whereCondition.type = type;
            if (branchId) whereCondition.branchId = branchId;
            if (category) whereCondition.category = category;
            if (search) {
                whereCondition[Op.or] = [
                    { '$name$': { [Op.like]: `%${search}%` } },
                ];
            }

            // Ordenar las facturas según el estado de pago
            const order = [["createdAt", "DESC"]]


            // Consultar las facturas
            const products = await Product.findAndCountAll({
                where: whereCondition,
                order,
                limit: pageSize,
                offset: offset,
            });

            return {
                error: false,
                statusCode: 200,
                message: "Productos recuperados exitosamente",
                data: {
                    category: category || "Todos",
                    products: products?.rows,
                    pagination: {
                        currentPage: Number(page),
                        totalPages: Math.ceil(products.count / pageSize),
                    },
                },
            };
        } catch (error) {
            console.error("Error al recuperar productos:", error);
            return {
                error: true,
                statusCode: 500,
                message: "Error al enviar",
            };
        }
    }





    
    static async getInvoicesDetails(params) {
        const { invoiceId } = params;

        try {
            // Buscar la factura por su ID
            const invoice = await Invoice.findByPk(invoiceId, {
                include: [
                    {
                        model: User,
                        as: "client",
                        attributes: ["id", "email"],
                        include: [{ model: Profile, attributes: ["codeUser", "name", "lastName"] }],
                    },
                    {
                        model: Business,
                    },
                    {
                        model: UserBusiness,
                        as: "collector",
                        attributes: ["id", "email"],
                        include: [{ model: ProfileBusiness, attributes: ["codeEmployee", "name", "lastName"] }],
                    },
                ],
            });

            if (!invoice) {
                return {
                    error: true,
                    statusCode: 404,
                    message: "Factura no encontrada",
                }
            }

            // Convertir la cadena JSON de productos en un objeto
            invoice.products = await JSON.parse(invoice.products);

            return {
                error: false,
                statusCode: 200,
                message: "Detalles de la factura recuperados exitosamenteaaa",
                data: {
                    id: invoice.id,
                    employee: {
                        codeEmployee: invoice.collector?.profiles_business?.codeEmployee,
                        name: invoice.collector?.profiles_business?.name,
                        lastName: invoice.collector?.profiles_business?.lastName || invoice.collector?.profiles_business?.dataValues?.lastName, // Acceso alternativo a lastName
                        email: invoice.collector?.email,
                    },
                    client: {
                        name: invoice.client?.profile?.name || null,
                        lastName: invoice.client?.profile?.lastName || invoice.client?.profile?.dataValues?.lastName || null, // Acceso alternativo a lastName
                    },
                    products: invoice?.products,
                    status: invoice.status, // O "pending"
                    branchId: invoice.branchId || null,
                    title: invoice.name || "",
                    description: invoice.note || "",
                    total: invoice.totalGeneral,
                    date: invoice.dateTimePayment ? invoice.dateTimePayment.toISOString() : null,
                    createdAt: invoice.createdAt.toISOString(),
                },
            };
        } catch (error) {
            console.error("Error al recuperar la factura:", error);
            return {
                error: true,
                statusCode: 500,
                message: "Error al enviar",
            };
        }
    }



}
