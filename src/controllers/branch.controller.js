import {
    sendResponse,
    validateRequiredFields,
} from "../helpers/utils.js";

// Models
import { Business } from "../models/business.js";
import { Branch } from "../models/branch.js";

export class BranchController {

    /**
     * Register a branch to a business
     */
    // POST business/branches/:businessId
    static async registerBranch(req, res) {
        const { businessId } = req.params;
        const { name, address, googleMap, operatingHours } = req.body;

        try {
            // Validar la presencia de los campos requeridos
            const requiredFields = [
                "name",
                "address",
                "googleMap",
                "operatingHours",
                "businessId",
            ];
            const missingFields = validateRequiredFields({...req.body, ...req.params}, requiredFields);
            if (missingFields.length > 0) {
                return sendResponse(res, 400, true, `Los campos son obligatorios: ${missingFields.join(", ")}`);
            }

            // Registrar sucursal  
            const newBranch = await Branch.create({ name, address, googleMap, operatingHours, businessId });

            return sendResponse(res, 201, false, "La sucursal ha sido registrada exitosamente");
        } catch (error) {
            console.error("Error al registrar la sucursal:", error);
            return sendResponse(res, 500, true, "Error al registrar la sucursal");
        }
    }

    /**
      * Obtener todas las sucursales de una empresa
      */
    // GET business/branches/:businessId
    static async getBranchesByBusiness(req, res) {
        const { businessId } = req.params;

        try {
            // Verificar si la empresa existe
            const business = await Business.findByPk(businessId);
            if (!business) {
                return sendResponse(res, 404, true, 'Negocio no encontrado');
            }

            // Buscar todas las sucursales de la empresa
            const branchesDB = await Branch.findAll({ where: { businessId } });

            // Parsear las horas de operación a objetos
            const branches = branchesDB.map(branch => ({
                ...branch.toJSON(),
                operatingHours: JSON.parse(branch.operatingHours)
            }));

            return sendResponse(res, 200, false, "Sucursales recuperadas exitosamente", branches);
        } catch (error) {
            console.error('Error getting branches by business ID:', error);
            return sendResponse(res, 500, true, 'No se pudieron recuperar sucursales');
        }
    };

    /**
      * Obtener detalle de una sucursal
      */
    // GET business/branches/by-id/:branchId
    static async getBrancheById(req, res) {
        const { branchId } = req.params;

        try {
            // Verificar si la sucursal existe
            const branch = await Branch.findByPk(branchId);
            if (!branch) {
                return sendResponse(res, 404, true, 'Sucursal no encontrado');
            }

            return sendResponse(res, 200, false, "Sucursal recuperada exitosamente", branch);
        } catch (error) {
            console.error('Error getting branch by business ID:', error);
            return sendResponse(res, 500, true, 'No se pudo recuperar la sucursal');
        }
    };

    /**
     * Actualizar una sucursal de una empresa
     */
    // PUT business/branches/:businessId/:branchId
    static async updateBranch(req, res) {
        const { branchId } = req.params;
        const { name, address, googleMap, operatingHours } = req.body;

        try {
            // Buscar la sucursal por su ID
            let branch = await Branch.findByPk(branchId);

            // Verificar si la sucursal existe
            if (!branch) {
                return sendResponse(res, 404, true, 'Sucursal no encontrado');
            }

            // Actualizar la sucursal con los nuevos datos
            branch = await branch.update({ name, address, googleMap, operatingHours });

            // Devolver la sucursal actualizada
            return sendResponse(res, 200, false, "Sucursal actualizada exitosamente", branch);
        } catch (error) {
            console.error('Error updating branch:', error);
            return sendResponse(res, 500, true, 'No se pudo actualizar la sucursal');
        }
    };

    /**
     * Eliminar una sucursal de una empresa
     */
    // DELETE business/branches/:businessId/:branchId
    static async deleteBranch(req, res) {
        const { branchId } = req.params;
        try {
            // Buscar la sucursal por su ID
            const branch = await Branch.findByPk(branchId);

            // Verificar si la sucursal existe
            if (!branch) {
                return sendResponse(res, 404, true, 'Sucursal no encontrado');
            }

            // Eliminar la sucursal
            await branch.destroy();

            // Devolver un mensaje de éxito
            return sendResponse(res, 200, false, "Sucursal eliminada exitosamente");
        } catch (error) {
            console.error('Error deleting branch:', error);
            return sendResponse(res, 500, true, 'no se pudo eliminar la sucursal');
        }
    };

}
