import { ProfileBusiness } from "../../models/business/profileBusiness.js";
import { UserBusiness } from "../../models/business/usersBusiness.js";


export class ProfileService {
    static async getCollectorProfile(userId) {
      const profile = await UserBusiness.findByPk(userId, {
        include: [{
          model: ProfileBusiness,
          attributes: ['additionalData']
        }]
      });
      if (!profile) {
        throw new Error("Perfil del cobrador no encontrado");
      }
      return profile;
    }
}
  