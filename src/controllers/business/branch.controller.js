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
     * @swagger
     * /api/v1/business/branches/{businessId}:
     *   post:
     *     summary: Register a new branch for a business
     *     tags: [Branch Management]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: businessId
     *         required: true
     *         schema:
     *           type: string
     *         description: ID of the business
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *               - address
     *               - country_cca2
     *             properties:
     *               name:
     *                 type: string
     *                 description: Name of the branch
     *               address:
     *                 type: string
     *                 description: Physical address of the branch
     *               googleMap:
     *                 type: string
     *                 description: Google Maps URL or coordinates
     *               country_cca2:
     *                 type: string
     *                 description: Country code (ISO 3166-1 alpha-2)
     *               operatingHours:
     *                 type: string
     *                 description: JSON string containing operating hours
     *     responses:
     *       201:
     *         description: Branch registered successfully
     *       400:
     *         description: Missing required fields
     *       404:
     *         description: Business not found
     *       500:
     *         description: Server error
     */
    // POST business/branches/:businessId
    static async registerBranch(req, res) {
        const result = await BranchService.registerBranch(req.locales, req.body)
        return sendResponse(res, result.statusCode, result.error, result.message, result.data);
    }


    /**
     * @swagger
     * /api/v1/business/branches/by-id/{branchId}:
     *   get:
     *     summary: Get details of a specific branch
     *     tags: [Branch Management]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: branchId
     *         required: true
     *         schema:
     *           type: string
     *         description: ID of the branch
     *     responses:
     *       200:
     *         description: Branch details retrieved successfully
     *       404:
     *         description: Branch not found
     *       500:
     *         description: Server error
     */
    // GET business/branches/by-id/:branchId
    static async getBrancheById(req, res) {
        const {branchId} = req.params
        const result = await BranchService.getBranchDetailsById({branchId})
        return sendResponse(res, result.statusCode, result.error, result.message, result.data);
    };

    /**
     * @swagger
     * /api/v1/business/branches/{businessId}/{branchId}:
     *   put:
     *     summary: Update a branch
     *     tags: [Branch Management]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: businessId
     *         required: true
     *         schema:
     *           type: string
     *         description: ID of the business
     *       - in: path
     *         name: branchId
     *         required: true
     *         schema:
     *           type: string
     *         description: ID of the branch to update
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 description: Name of the branch
     *               address:
     *                 type: string
     *                 description: Physical address of the branch
     *               googleMap:
     *                 type: string
     *                 description: Google Maps URL or coordinates
     *               operatingHours:
     *                 type: string
     *                 description: JSON string containing operating hours
     *     responses:
     *       200:
     *         description: Branch updated successfully
     *       404:
     *         description: Branch not found
     *       500:
     *         description: Server error
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
     * @swagger
     * /api/v1/business/branches/{businessId}/{branchId}:
     *   delete:
     *     summary: Delete a branch
     *     tags: [Branch Management]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: businessId
     *         required: true
     *         schema:
     *           type: string
     *         description: ID of the business
     *       - in: path
     *         name: branchId
     *         required: true
     *         schema:
     *           type: string
     *         description: ID of the branch to delete
     *     responses:
     *       200:
     *         description: Branch deleted successfully
     *       404:
     *         description: Branch not found
     *       500:
     *         description: Server error
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
