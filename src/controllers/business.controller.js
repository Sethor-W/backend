import {
    sendResponse,
    validateRequiredFields,
} from "../helpers/utils.js";

// Models
import { Op } from "sequelize";
import { Business } from "../models/common/business.js";
import { ProfileBusiness } from "../models/business/profileBusiness.js";
import { EmployeesAssociatedBusinesses } from "../models/business/employeesAssocitedBusiness.js";
import { BusinessCommonService } from "../services/common/business.service.js";

export class BusinessController {

    /**
     * @swagger
     * /api/v1/business:
     *   post:
     *     summary: Register a new business
     *     tags: [Business]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *               - rut_business
     *               - tax_code
     *             properties:
     *               name:
     *                 type: string
     *                 description: Business name
     *               rut_business:
     *                 type: string
     *                 description: Business tax ID
     *               tax_code:
     *                 type: string
     *                 description: Business tax code
     *     responses:
     *       201:
     *         description: Business registered successfully
     *       400:
     *         description: Missing required fields
     *       500:
     *         description: Server error
     */
    // POST business/
    static async registerBusiness(req, res) {
        try {
            const { userId } = req.user;
            const { name, rut_business, tax_code } = req.body;

            // Validar la presencia de los campos requeridos
            const requiredFields = [
                "name",
                "rut_business",
                "tax_code",
            ];
            const missingFields = validateRequiredFields(req.body, requiredFields);
            if (missingFields.length > 0) {
                return sendResponse(res, 400, true, `Los campos son obligatorios: ${missingFields.join(", ")}`);
            }

            // Registrar empresa   
            const newBusiness = await Business.create({ name, rut_business, tax_code, ownerId: userId });

            return sendResponse(res, 201, false, "La empresa ha sido registrada exitosamente", newBusiness);
        } catch (error) {
            console.error("Error al registrar el negocio:", error);
            return sendResponse(res, 500, true, "Error al registrar el negocio");
        }
    }


    /**
     * @swagger
     * /api/v1/business/name/search:
     *   get:
     *     summary: Search businesses by name
     *     tags: [Business]
     *     parameters:
     *       - in: query
     *         name: name
     *         required: true
     *         schema:
     *           type: string
     *         description: Name to search for
     *     responses:
     *       200:
     *         description: Businesses retrieved successfully
     *       404:
     *         description: No businesses found for the search term
     *       500:
     *         description: Server error
     */
    // GET business/name/search?name=search
    static async searchBusinessByName(req, res) {
        const { name } = req.query;
        try {
            // Realizar la búsqueda flexible por nombre
            const businesses = await Business.findAll({
                where: {
                    name: {
                        [Op.like]: `%${name}%`
                    }
                },
                attributes: {
                    exclude: ['ownerId', 'createdAt', 'updatedAt', 'validated_business', 'rut_business', 'tax_code']
                }
            });

            // Comprobar si se encontraron empresas
            if (!businesses || businesses.length === 0) {
                return sendResponse(res, 404, true, 'No se encontraron empresas para el término de búsqueda proporcionado');
            }

            return sendResponse(res, 200, false, 'Empresas recuperadas con éxito', businesses);
        } catch (error) {
            console.error('Error searching businesses by name:', error);
            return sendResponse(res, 500, true, 'No se pudieron buscar empresas');
        }
    };

    /**
     * @swagger
     * /api/v1/business/{id}:
     *   put:
     *     summary: Update a business
     *     tags: [Business]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Business ID
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               description:
     *                 type: string
     *                 description: Business description
     *               address:
     *                 type: string
     *                 description: Business address
     *               profilePicture:
     *                 type: string
     *                 description: URL to business profile picture
     *               coverPicture:
     *                 type: string
     *                 description: URL to business cover picture
     *     responses:
     *       200:
     *         description: Business updated successfully
     *       404:
     *         description: Business not found
     *       500:
     *         description: Server error
     */
    // PUT business/:id
    static async updateBusiness(req, res) {
        const { id } = req.params;
        const { description, address, profilePicture, coverPicture } = req.body;
        try {
            const business = await Business.findByPk(id);
            if (!business) {
                return sendResponse(res, 404, true, 'Negocio no encontrado');
            }

            // Actualizar la empresa
            await business.update({
                description,
                address,
                profilePicture,
                coverPicture
            });

            return sendResponse(res, 200, false, 'Negocio actualizado exitosamente', business);
        } catch (error) {
            console.error('Error updating business:', error);
            return sendResponse(res, 500, true, 'No se pudo actualizar el negocio');
        }
    }

    /**
     * @swagger
     * /api/v1/business/{id}:
     *   delete:
     *     summary: Delete a business
     *     tags: [Business]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Business ID
     *     responses:
     *       200:
     *         description: Business deleted successfully
     *       403:
     *         description: Only the owner can delete this business
     *       404:
     *         description: Business not found
     *       500:
     *         description: Server error
     */
    // DELETE business/:id
    static async deleteBusiness(req, res) {
        const { id } = req.params;
        const { userId } = req.user;
        try {
            const business = await Business.findByPk(id);
            if (!business) {
                return sendResponse(res, 404, true, 'Negocio no encontrado');
            }

            // Verificar si el usuario es el propietario de la empresa
            if (business.ownerId !== userId) {
                return sendResponse(res, 403, true, 'Sólo el propietario puede eliminar esta empresa');
            }

            // Eliminar la empresa
            await business.destroy();

            return sendResponse(res, 200, false, 'Negocio eliminado exitosamente');
        } catch (error) {
            console.error('Error deleting business:', error);
            return sendResponse(res, 500, true, 'No se pudo eliminar el negocio');
        }
    }


     /** ********************************
     * COLLECTOR
     ******************************** */

    /**
     * @swagger
     * /api/v1/business/employee/getBusiness:
     *   get:
     *     summary: Get business details for the authenticated employee
     *     tags: [Business - Employee]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Business details retrieved successfully
     *       500:
     *         description: Server error
     */
    // Get business/employee/getBusiness/
    static async getBusinessDetailsToEmployeeWithJWT(req, res) {
        const { userId } = req.user;

        try {
            const businessAssociated = await EmployeesAssociatedBusinesses.findOne({
                where: {
                    usersBusinessId: userId,
                },
                include: [
                    {
                        model: Business,
                        attributes: ['id', 'ownerId', 'name', 'rut_business', 'description', 'address', 'profilePicture', 'coverPicture']
                    }
                ]
            })

            return sendResponse(res, 200, false, 'Detalles comerciales recuperados exitosamente', businessAssociated);
        } catch (error) {
            console.error('Error getting business details:', error);
            return sendResponse(res, 500, true, 'No se pudo recuperar los detalles del negocio');
        }
    }


    /** ********************************
     * EMLOYEE
     ******************************** */

    /**
     * @swagger
     * /api/v1/business/employee/getAllBusiness/{businessId}:
     *   get:
     *     summary: Get business details for an employee
     *     tags: [Business - Employee]
     *     parameters:
     *       - in: path
     *         name: businessId
     *         required: true
     *         schema:
     *           type: string
     *         description: ID of the business
     *     responses:
     *       200:
     *         description: Business details retrieved successfully
     *       404:
     *         description: Business or owner profile not found
     *       500:
     *         description: Server error
     */
    // Get business/employee/getAllBusiness/:businessId
    static async getBusinessDetailsToEmployee(req, res) {
        const { businessId } = req.params;

        try {
            const business = await Business.findByPk(businessId, {
                attributes: ['id', 'ownerId','name', 'rut_business', 'description', 'address', 'profilePicture', 'coverPicture']
            });
            
            if (!business) {
                return sendResponse(res, 404, true, 'Negocio no encontrado');
            }

            // Buscar el perfil del propietario utilizando ownerId
            const profileOwner = await ProfileBusiness.findOne({
                where: { usersBusinessId: business.ownerId },
                attributes: ['id', 'name', 'lastname', 'phone', 'additionalData']
            });

            if (!profileOwner) {
                return sendResponse(res, 404, true, 'Perfil del propietario no encontrado');
            }

            const businessDetails = {
                ...business.toJSON(),
                owner: profileOwner
            };

            return sendResponse(res, 200, false, 'Detalles comerciales recuperados exitosamente', businessDetails);
        } catch (error) {
            console.error('Error getting business details:', error);
            return sendResponse(res, 500, true, 'No se pudo recuperar los detalles del negocio');
        }
    }


    /** ********************************
     * OWNER
     ******************************** */

    /**
     * @swagger
     * /api/v1/business/owner/getAllBusiness:
     *   get:
     *     summary: Get all businesses owned by the authenticated user
     *     tags: [Business - Owner]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Businesses retrieved successfully
     *       500:
     *         description: Server error
     */
    // Get business/owner/getAllBusiness/
    static async getAllBusinessByOwner(req, res) {
        const { userId } = req.user;
        try {
            const businesses = await Business.findAll({
                where: { ownerId: userId }
            });
    
            // if (!businesses || businesses.length === 0) {
            //     return sendResponse(res, 404, true, 'No se encontraron negocios for this owner');
            // }
    
            return sendResponse(res, 200, false, 'Empresas recuperadas con éxito', businesses);
        } catch (error) {
            console.error('Error al recuperar empresas:', error);
            return sendResponse(res, 500, true, 'Error al recuperar empresas');
        }
    }

    

}
