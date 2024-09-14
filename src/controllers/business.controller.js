import {
    sendResponse,
    validateRequiredFields,
} from "../helpers/utils.js";

// Models
import { Op } from "sequelize";
import { Business } from "../models/business.js";
import { ProfileBusiness } from "../models/profileBusiness.js";
import { EmployeesAssociatedBusinesses } from "../models/employeesAssocitedBusiness.js";

export class BusinessController {

    /**
     * Register a business
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
      * Obtener todos los detalles de la empresa
      */
    // GET business/all/:id
    static async getBusinessAllDetailsById(req, res) {
        const { id } = req.params;
        try {
            const business = await Business.findByPk(id);
            if (!business) {
                return sendResponse(res, 404, true, 'Negocio no encontrado');
            }

            return sendResponse(res, 200, false, "Detalles comerciales recuperados exitosamente", business);
        } catch (error) {
            console.error('Error getting business by ID:', error);
            return sendResponse(res, 500, true, 'No se pudo recuperar el negocio');
        }
    };

    /**
      * Obtener detalles publicos de la empresa por nombre
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
     * Actualizar una empresa
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
     * Eliminar una empresa
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
     * PUBLIC
     ******************************** */
    
    /**
      * Obtener detalles publicos de la empresa
      */
    // GET business/:id
    static async getBusinessPublicDetailsById(req, res) {
        const { id } = req.params;
        try {
            const business = await Business.findByPk(id, {
                attributes: {
                    exclude: ['ownerId', 'createdAt', 'updatedAt', 'validated_business', 'rut_business', 'tax_code']
                }
            });
            if (!business) {
                return sendResponse(res, 404, true, 'Negocio no encontrado');
            }

            return sendResponse(res, 200, false, "Detalles comerciales recuperados exitosamente", business);
        } catch (error) {
            console.error('Error getting business by ID:', error);
            return sendResponse(res, 500, true, 'No se pudo recuperar el negocio');
        }
    };

    /**
      * Obtener listado de empresas registradas
      */
    // GET business/public/all?page=1&search=puerto
    static async getAllBusinessPublic(req, res) {
        const { page, search } = req.query;

        try {
            // Configurar la condición de búsqueda si se proporciona el parámetro `search`
            const whereCondition = {
                ...(search && { name: { [Op.like]: `%${search}%` } })
            };

            
            // Configurar opciones de paginación
            const pageSize = 15;
            const pageNumber = page || 1;  // Establece el número de página en 1 si no se proporciona
            const offset = (pageNumber - 1) * pageSize;

            const optionsPagination = {
                limit: pageSize,
                offset: offset,
            };


            const businesses = await Business.findAndCountAll({
                where: whereCondition,
                // attributes: {
                //     exclude: ['ownerId', 'createdAt', 'updatedAt', 'validated_business', 'rut_business', 'tax_code']
                // },
                order: [['name', 'DESC']],
                ...optionsPagination
            });

            // Verificar si se encontraron empresas
            if (!businesses.rows.length) {
                return sendResponse(res, 404, true, 'No se encontraron negocios');
            }

            return sendResponse(res, 200, false, "Empresas recuperadas con éxito", {
                count: businesses.count,
                total: businesses.count,
                page: pageNumber,
                pageSize,
                businesses: businesses.rows,
            });
        } catch (error) {
            console.error('Error getting business by ID:', error);
            return sendResponse(res, 500, true, 'No se pudo recuperar el negocio');
        }
    };


     /** ********************************
     * COLLECTOR
     ******************************** */

    /**
     * Obtener empresa por el cobrador
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
     * Obtener empresa por el empleado
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
     * Obtener listado de empresas por el propietario
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
