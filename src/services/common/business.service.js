import { Product } from "../../models/client/product.js";
import { Branch } from "../../models/common/branch.js";
import { Business } from "../../models/common/business.js";


export class BusinessCommonService {

    static async getBusinessDetailsById({businessId}) {
        try {
            const business = await Business.findByPk(businessId, {
                include: [
                    {
                        model: Branch,
                        as: 'branches',
                        attributes: ['id', 'name', 'address', 'country_cca2', 'googleMap', 'main'],
                    },
                    {
                        model: Product,
                        as: 'products', // Asegúrate de que este alias coincide con tu configuración en el modelo
                        attributes: ['id'], // Solo necesitas los IDs para contar los productos
                    },
                ],
                attributes: ['id', 'name', 'description', 'profilePicture', 'coverPicture', ],
            });
            if (!business) {
                return {
                    error: true,
                    statusCode: 404,
                    message: "Negocio no encontrado'",
                };
            }

            // Calcular el número de productos
            const productCount = business.products ? business.products.length : 0;

            const businessData = business.toJSON();
            delete businessData.products;

            // Respuesta exitosa
            return {
                error: false,
                statusCode: 200,
                message: "Detalles comerciales recuperados exitosamente",
                data: {
                    ...businessData,
                    productCount,
                },
            };

        } catch (error) {
            console.error("Error al recuperar detalles de la empresa:", error);
            return {
                error: true,
                statusCode: 500,
                message: "Error al recuperar detalles de la empresa",
            };
        }
    }

    
}
  