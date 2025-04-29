import { sendResponse } from "../helpers/utils.js";
import { BusinessFunction } from "../models/business/businessFunction.js";


export class BusinessFunctionController {


    /**
     * @swagger
     * /api/v1/business/functions:
     *   get:
     *     summary: Get all business functions
     *     tags: [Business Functions]
     *     responses:
     *       200:
     *         description: Functions retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: boolean
     *                   example: false
     *                 message:
     *                   type: string
     *                   example: Funciones recuperadas exitosamente
     *                 data:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       id:
     *                         type: string
     *                       name:
     *                         type: string
     *                       description:
     *                         type: string
     *       500:
     *         description: Server error
     */
    // GET business/functions
    static async getBusinessFunction(req, res) {

        try {
            const functions = await BusinessFunction.findAll();

            return sendResponse(res, 200, false, "Funciones recuperadas exitosamente", functions);
        } catch (error) {
            console.error('Error getting functions:', error);
            return sendResponse(res, 500, true, 'No se pudieron recuperar funciones');
        }
    };

}