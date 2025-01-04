
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
            page = parseInt(page, 10) || 1; // Si `page` no es válido, asignar 1 como valor predeterminado
            const pageSize = 15;
            const offset = (page - 1) * pageSize;

            // Configurar la condición de consulta para incluir todas las facturas si no se proporciona un estado
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

            // Ordenar las facturas según el estado de pago
            const order = [
                ["createdAt", "DESC"]
            ]


            // Consultar las facturas
            const products = await Product.findAndCountAll({
                where: whereCondition,
                order,
                // include: [
                //     {
                //         model: Branch,
                //         attributes: ['id', 'name', 'address', 'country_cca2', 'googleMap', 'main'],
                //     },
                // ],
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