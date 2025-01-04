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
      * Obtener todos los detalles de la empresa
      */
    // GET business/all/:id
    static async getBusinessAllDetailsById(req, res) {
        const { businessId } = req.params;
        const result = await BusinessCommonService.getBusinessDetailsById({businessId})
        return sendResponse(res, result.statusCode, result.error, result.message, result.data);
    };

}
