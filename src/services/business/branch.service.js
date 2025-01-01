import { Branch } from "../../models/common/branch.js";

// services/BranchService.js
export class BranchService {


    static async getBranchFromProfile(profile) {
      if (!profile.profiles_business.additionalData) {
        throw new Error("El cobrador no tiene una sucursal asignada");
      }
      const additionalData = JSON.parse(profile.profiles_business.additionalData);
      const branchId = additionalData.branch.id;
      return await Branch.findByPk(branchId);
    }
}
  
  