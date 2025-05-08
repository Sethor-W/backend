import {
    sendResponse,
    validateRequiredFields,
} from "../helpers/utils.js";

// Models
import { Business } from "../models/common/business.js";
import { Branch } from "../models/common/branch.js";

export class BranchController {

    /**
     * @swagger
     * /api/v1/business/{businessId}/branches:
     *   post:
     *     summary: Register a branch to a business
     *     tags: [Branches]
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
     *               - googleMap
     *               - country_cca2
     *             properties:
     *               name:
     *                 type: string
     *                 description: Branch name
     *               address:
     *                 type: string
     *                 description: Branch address
     *               googleMap:
     *                 type: string
     *                 description: Google Maps location
     *               operatingHours:
     *                 type: object
     *                 description: JSON object with operating hours
     *               country_cca2:
     *                 type: string
     *                 description: Country code (2 characters)
     *               photo:
     *                 type: string
     *                 description: Branch photo URL
     *               main:
     *                 type: boolean
     *                 description: Whether this is the main branch
     *     responses:
     *       201:
     *         description: Branch registered successfully
     *       400:
     *         description: Missing required fields
     *       500:
     *         description: Server error
     */
    // POST business/branches/:businessId
    static async registerBranch(req, res) {
        const { businessId } = req.params;
        const { name, address, googleMap, operatingHours, country_cca2, photo, main } = req.body;

        try {
            // Validar la presencia de los campos requeridos
            const requiredFields = [
                "name",
                "address",
                "googleMap",
                "country_cca2",
            ];
            const missingFields = validateRequiredFields({...req.body, ...req.params}, requiredFields);
            if (missingFields.length > 0) {
                return sendResponse(res, 400, true, `Los campos son obligatorios: ${missingFields.join(", ")}`);
            }

            console.log(req.body);

            // Registrar sucursal  
            const newBranch = await Branch.create({ 
                name, 
                address, 
                googleMap, 
                operatingHours, 
                businessId, 
                country_cca2,
                photo,
                main
            });

            return sendResponse(res, 201, false, "La sucursal ha sido registrada exitosamente", newBranch);
        } catch (error) {
            console.error("Error al registrar la sucursal:", error);
            return sendResponse(res, 500, true, "Error al registrar la sucursal");
        }
    }

    /**
     * @swagger
     * /api/v1/business/{businessId}/branches:
     *   get:
     *     summary: Get all branches of a business
     *     tags: [Branches]
     *     parameters:
     *       - in: path
     *         name: businessId
     *         required: true
     *         schema:
     *           type: string
     *         description: ID of the business
     *     responses:
     *       200:
     *         description: Branches retrieved successfully
     *       404:
     *         description: Business not found
     *       500:
     *         description: Server error
     */
    // GET business/branches/:businessId
    static async getBranchesByBusiness(req, res) {
        const { businessId } = req.locales;

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
                // operatingHours: JSON.parse(branch.operatingHours)
            }));

            return sendResponse(res, 200, false, "Sucursales recuperadas exitosamente", branches);
        } catch (error) {
            console.error('Error getting branches by business ID:', error);
            return sendResponse(res, 500, true, 'No se pudieron recuperar sucursales');
        }
    };

    /**
     * @swagger
     * /api/v1/business/{businessId}/branches/by-id/{branchId}:
     *   get:
     *     summary: Get details of a specific branch
     *     tags: [Branches]
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
     * @swagger
     * /api/v1/business/{businessId}/branches/{branchId}:
     *   put:
     *     summary: Update a branch
     *     tags: [Branches]
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
     *         description: ID of the branch
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 description: Branch name
     *               address:
     *                 type: string
     *                 description: Branch address
     *               googleMap:
     *                 type: string
     *                 description: Google Maps location
     *               operatingHours:
     *                 type: string
     *                 description: JSON string with operating hours
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
     * /api/v1/business/{businessId}/branches/{branchId}:
     *   delete:
     *     summary: Delete a branch
     *     tags: [Branches]
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
     *         description: ID of the branch
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
