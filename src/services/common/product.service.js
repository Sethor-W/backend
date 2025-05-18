
import {
    Op
} from "sequelize";
import {
    Product
} from "../../models/client/product.js";
import { Branch } from "../../models/common/branch.js";

export class ProductCommonService {


    static async getAllProducts(params, query, locales) {
        const {
            businessId
        } = locales;
        let {
            type,
            page,
            search,
            branchId,
            category
        } = query;

        try {
            // Configurar la condición de consulta base
            const whereCondition = {
                businessId
            };

            if (type) whereCondition.type = type;
            if (branchId) whereCondition.branchId = branchId;
            if (category) whereCondition.category = category;
            if (search) {
                whereCondition[Op.or] = [{
                    '$name$': {
                        [Op.like]: `%${search}%`
                    }
                },];
            }

            // Ordenar los productos por fecha de creación
            const order = [
                ["createdAt", "DESC"]
            ];

            // Si no se proporciona página, traer todos los productos
            if (!page) {
                const products = await Product.findAll({
                    where: whereCondition,
                    order,
                });

                return {
                    error: false,
                    statusCode: 200,
                    message: "Productos recuperados exitosamente",
                    data: {
                        category: category || "Todos",
                        products: products,
                        pagination: null
                    },
                };
            }

            // Si se proporciona página, usar paginación
            page = parseInt(page, 10) || 1;
            const pageSize = 15;
            const offset = (page - 1) * pageSize;

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


}