
import { sendResponse } from "../helpers/utils.js";
import { Profile } from "../models/profile.js";
import { User } from "../models/users.js";


export class ProfileController {


    /**
     * Obtener el perfil del usuario
     */
    // PUT users/profile
    static async getUserProfile(req, res) {
        const { userId } = req.user;
        try {
            
            const profile = await User.findByPk(userId, {
                attributes: ['id', 'email'],
                include: [
                    {
                        model: Profile,
                    }
                ]
            });

            
            if (!profile) {
                return sendResponse(res, 404, true, "Profile not found");
            }

            return sendResponse(res, 200, false, 'Profile retrieved successfully', profile);
        } catch (error) {
            console.error('Error retrieving user profile:', error);
            return sendResponse(res, 500, true, 'Could not retrieve profile');
        }
    }



}