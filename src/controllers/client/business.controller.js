import {
    sendResponse,
    validateRequiredFields,
} from "../../helpers/utils.js";

// Models
import { Op } from "sequelize";
import { Business } from "../../models/common/business.js";
import { ProfileBusiness } from "../../models/business/profileBusiness.js";
import { EmployeesAssociatedBusinesses } from "../../models/business/employeesAssocitedBusiness.js";
import { BusinessCommonService } from "../../services/common/business.service.js";
import { Branch } from "../../models/common/branch.js";

export class BusinessClientController {

    /**
      * Obtener listado de empresas registradas
      */
    // GET business?page=1&search=puerto
    static async getAllBusiness(req, res) {
        let { page, search } = req.query;

        try {
            // Configurar la condición de búsqueda si se proporciona el parámetro `search`
            const whereCondition = {
                ...(search && { name: { [Op.like]: `%${search}%` } })
            };

            
            // Configurar opciones de paginación
            page = parseInt(page, 10) || 1;  // Si `page` no es válido, asignar 1 como valor predeterminado
            const pageSize = 15;
            const offset = (page - 1) * pageSize;


            const optionsPagination = {
                limit: pageSize,
                offset: offset,
            };


            const businesses = await Business.findAndCountAll({
                where: whereCondition,
                order: [['name', 'DESC']],
                include: [
                    {
                        model: Branch,
                        as: 'branches',
                        attributes: ['id', 'name', 'address', 'country_cca2', 'googleMap', 'main'],
                    }
                ],
                attributes: ['id', 'name', 'description', 'profilePicture', 'coverPicture', ],
                ...optionsPagination
            });

           
            // Verificar si se encontraron empresas
            if (!businesses.rows.length) {
                return sendResponse(res, 404, true, 'No se encontraron negocios');
            }

            return sendResponse(res, 200, false, "Empresas recuperadas con éxito", {
                businesses: businesses.rows,
                pagination: {
                    count: businesses.count,
                    currentPage: Number(page),
                    totalPages: Math.ceil(businesses.count / pageSize),
                },
            });
        } catch (error) {
            console.error('Error getting business by ID:', error);
            return sendResponse(res, 500, true, 'No se pudo recuperar el negocio');
        }
    };

}
