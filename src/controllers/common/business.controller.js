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

export class BusinessCommonController {

  
    /**
     * @swagger
     * /api/v1/business/all/{businessId}:
     *   get:
     *     summary: Get all details of a business
     *     tags: [Business]
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
     *         description: Business details retrieved successfully
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
     *                   example: Business details retrieved successfully
     *                 data:
     *                   type: object
     *       400:
     *         description: Bad request
     *       404:
     *         description: Business not found
     *       500:
     *         description: Server error
     */
    // GET business/all/:id
    static async getBusinessAllDetailsById(req, res) {
        const { businessId } = req.params;
        const result = await BusinessCommonService.getBusinessDetailsById({businessId})
        return sendResponse(res, result.statusCode, result.error, result.message, result.data);
    };

}
