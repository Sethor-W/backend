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
                ],
                attributes: ['id', 'name', 'description'],
            });
            if (!business) {
                return {
                    error: true,
                    statusCode: 404,
                    message: "Negocio no encontrado'",
                };
            }

            // Respuesta exitosa
            return {
                error: false,
                statusCode: 200,
                message: "Detalles comerciales recuperados exitosamente",
                data: business,
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
  