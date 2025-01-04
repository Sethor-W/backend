import {
    sendResponse,
    validateRequiredFields,
} from "../../helpers/utils.js";

// Models
import { Business } from "../../models/common/business.js";
import { Branch } from "../../models/common/branch.js";
import { BranchService } from "../../services/business/branch.service.js";

export class BranchBusinessController {

    /**
     * Register a branch to a business
     */
    // POST business/branches/:businessId
    static async registerBranch(req, res) {
        const result = await BranchService.registerBranch(req.locales, req.body)
        return sendResponse(res, result.statusCode, result.error, result.message, result.data);
    }


    /**
      * Obtener detalle de una sucursal
      */
    // GET business/branches/by-id/:branchId
    static async getBrancheById(req, res) {
        const {branchId} = req.params
        const result = await BranchService.getBranchDetailsById({branchId})
        return sendResponse(res, result.statusCode, result.error, result.message, result.data);
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
