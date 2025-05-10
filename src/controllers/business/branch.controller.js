import {
    sendResponse,
    validateRequiredFields,
} from "../../helpers/utils.js";

// Models
import { Branch } from "../../models/common/branch.js";
import { Business } from "../../models/common/business.js";
import { BranchService } from "../../services/business/branch.service.js";

export class BranchBusinessController {

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
    // POST business/:businessId/branches
    static async registerBranch(req, res) {
        const result = await BranchService.registerBranch(req.locales, req.body)
        return sendResponse(res, result.statusCode, result.error, result.message, result.data);
    }


    /**
     * @swagger
     * /api/v1/business/{businessId}/branches:
     *   get:
     *     summary: Get all branches of a business
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
     *     responses:
     *       200:
     *         description: Branches retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Branch'
     *       404:
     *         description: Business not found
     *       500:
     *         description: Server error
     */
    // GET business/:businessId/branches
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
     * /api/v1/business/{businessId}/branches/{branchId}:
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
    // GET business/:businessId/branches/:branchId
    static async getBrancheById(req, res) {
        const {branchId} = req.params
        const result = await BranchService.getBranchDetailsById({branchId})
        return sendResponse(res, result.statusCode, result.error, result.message, result.data);
    };


    // /**
    //  * @swagger
    //  * /api/v1/business/{businessId}/branches/{branchId}:
    //  *   get:
    //  *     summary: Get details of a specific branch
    //  *     tags: [Branches]
    //  *     parameters:
    //  *       - in: path
    //  *         name: businessId
    //  *         required: true
    //  *         schema:
    //  *           type: string
    //  *         description: ID of the business
    //  *       - in: path
    //  *         name: branchId
    //  *         required: true
    //  *         schema:
    //  *           type: string
    //  *         description: ID of the branch
    //  *     responses:
    //  *       200:
    //  *         description: Branch details retrieved successfully
    //  *       404:
    //  *         description: Branch not found
    //  *       500:
    //  *         description: Server error
    //  */
    // // GET business/:businessId/branches/:branchId
    // static async getBrancheById(req, res) {
    //     const { branchId } = req.params;

    //     try {
    //         // Verificar si la sucursal existe
    //         const branch = await Branch.findByPk(branchId);
    //         if (!branch) {
    //             return sendResponse(res, 404, true, 'Sucursal no encontrado');
    //         }

    //         return sendResponse(res, 200, false, "Sucursal recuperada exitosamente", branch);
    //     } catch (error) {
    //         console.error('Error getting branch by business ID:', error);
    //         return sendResponse(res, 500, true, 'No se pudo recuperar la sucursal');
    //     }
    // };

    /**
     * @swagger
     * /api/v1/business/{businessId}/branches/{branchId}:
     *   put:
     *     summary: Update branch information
     *     description: Update details of a specific branch for a business
     *     tags: [Branches]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: businessId
     *         required: true
     *         schema:
     *           type: string
     *         description: The ID of the business that owns the branch
     *         example: 5f8d0d55b54764421b7156c3
     *       - in: path
     *         name: branchId
     *         required: true
     *         schema:
     *           type: string
     *         description: The ID of the branch to update
     *         example: 5f8d0d55b54764421b7156c4
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 description: The updated name of the branch
     *                 example: "Main Office"
     *               address:
     *                 type: string
     *                 description: The updated physical address of the branch
     *                 example: "123 Main St, City, Country"
     *               googleMap:
     *                 type: string
     *                 description: Google Maps URL or embed code for the branch location
     *                 example: "https://goo.gl/maps/XYZ123"
     *               operatingHours:
     *                 type: string
     *                 description: JSON string containing operating hours
     *                 example: '{"monday":"9:00-18:00","tuesday":"9:00-18:00"}'
     *               country_cca2:
     *                 type: string
     *                 description: 2-letter country code
     *                 example: "CL"
     *               photo:
     *                 type: string
     *                 description: URL or path to branch photo
     *                 example: "https://example.com/branch.jpg"
     *               main:
     *                 type: boolean
     *                 description: Whether this is the main branch
     *                 example: true
     *     responses:
     *       200:
     *         description: Branch successfully updated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Branch'
     *       400:
     *         description: Invalid input data
     *       401:
     *         description: Unauthorized - Missing or invalid token
     *       403:
     *         description: Forbidden - User doesn't have permission
     *       404:
     *         description: Branch not found
     *       500:
     *         description: Internal server error
     */
    // PUT business/:businessId/branches/:branchId
    static async updateBranch(req, res) {
        const { branchId } = req.params;
        const { name, address, googleMap, operatingHours, country_cca2, photo, main } = req.body;

        try {
            // Buscar la sucursal por su ID
            let branch = await Branch.findByPk(branchId);

            // Verificar si la sucursal existe
            if (!branch) {
                return sendResponse(res, 404, true, 'Sucursal no encontrado');
            }

            // Actualizar la sucursal con los nuevos datos
            branch = await branch.update({ 
                name, 
                address, 
                googleMap, 
                operatingHours,
                country_cca2,
                photo,
                main
            });

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
    // DELETE business/businessId/branches/:branchId
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
