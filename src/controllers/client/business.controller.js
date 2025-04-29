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
     * @swagger
     * /api/v1/client/business:
     *   get:
     *     summary: Get list of registered businesses
     *     tags: [Client Business]
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           default: 1
     *         description: Page number for pagination
     *       - in: query
     *         name: search
     *         schema:
     *           type: string
     *         description: Search term to filter businesses by name
     *     responses:
     *       200:
     *         description: Businesses retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 statusCode:
     *                   type: integer
     *                   example: 200
     *                 error:
     *                   type: boolean
     *                   example: false
     *                 message:
     *                   type: string
     *                   example: Empresas recuperadas con éxito
     *                 data:
     *                   type: object
     *                   properties:
     *                     businesses:
     *                       type: array
     *                       items:
     *                         type: object
     *                     pagination:
     *                       type: object
     *                       properties:
     *                         count:
     *                           type: integer
     *                         currentPage:
     *                           type: integer
     *                         totalPages:
     *                           type: integer
     *       404:
     *         description: No businesses found
     *       500:
     *         description: Server error
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
