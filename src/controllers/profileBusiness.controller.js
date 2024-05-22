import { sendResponse } from "../helpers/utils.js";
import { ProfileBusiness } from "../models/profileBusiness.js";
import { UserBusinessRole } from "../models/userBusinessRoles.js";
import { UserBusiness } from "../models/usersBusiness.js";


export class ProfileBusinessController {


    /**
     * Obtener el perfil del usuario
     */
    // PUT business/users/profile
    static async getUserProfile(req, res) {
        const { userId } = req.user;
        try {

            
            const profile = await UserBusiness.findByPk(userId, {
                attributes: ['id', 'email', 'status', 'keyword'],
                include: [
                    {
                        model: ProfileBusiness,
                    },
                    {
                        model: UserBusinessRole,
                    },
                ]
            });

            
            if (!profile) {
                return sendResponse(res, 404, true, "Profile not found");
            }

            if (profile.profiles_business.additionalData) {
                // Convertir la cadena JSON de productos en un objeto
                profile.profiles_business.additionalData = await JSON.parse(profile.profiles_business.additionalData);
                if (profile.profiles_business.additionalData?.branch?.operatingHours) {
                    profile.profiles_business.additionalData.branch.operatingHours = JSON.parse(profile.profiles_business.additionalData.branch.operatingHours);
                }
            }

            return sendResponse(res, 200, false, 'Profile retrieved successfully', profile);
        } catch (error) {
            console.error('Error retrieving user profile:', error);
            return sendResponse(res, 500, true, 'Could not retrieve profile');
        }
    }

}