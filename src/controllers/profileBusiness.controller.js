import { sendResponse } from "../helpers/utils.js";
import { ProfileBusiness } from "../models/business/profileBusiness.js";
import { UserBusinessRole } from "../models/business/userBusinessRoles.js";
import { UserBusiness } from "../models/business/usersBusiness.js";


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
                return sendResponse(res, 404, true, "Perfil no encontrado");
            }

            if (profile.profiles_business.additionalData) {
                // Convertir la cadena JSON de productos en un objeto
                profile.profiles_business.additionalData = await JSON.parse(profile.profiles_business.additionalData);
                if (profile.profiles_business.additionalData?.branch?.operatingHours) {
                    profile.profiles_business.additionalData.branch.operatingHours = JSON.parse(profile.profiles_business.additionalData.branch.operatingHours);
                }
            }

            return sendResponse(res, 200, false, 'Perfil recuperado exitosamente', profile);
        } catch (error) {
            console.error('Error al recuperar el perfil de usuario:', error);
            return sendResponse(res, 500, true, 'No se pudo recuperar el perfil');
        }
    }

    /**
     * Actualizar el perfil del usuario
     */
    // PUT /users/profile
    static async updateUserProfile(req, res) {
        const { userId } = req.user;
        const { phone, profilePicture } = req.body;

        try {
            // Buscar el perfil del usuario por el userId
            const profile = await ProfileBusiness.findOne({ where: { usersBusinessId: userId } });  

            if (!profile) {
                return sendResponse(res, 404, true, "Perfil no encontrado");
            }

            profile.phone = phone || profile.phone;
            profile.profilePicture = profilePicture || profile.profilePicture

            // Guardar los cambios en la base de datos
            await profile.save();

            return sendResponse(res, 200, false, 'Perfil actualizado exitosamente', profile);
        } catch (error) {
            console.error('Error al actualizar el perfil de usuario:', error);
            return sendResponse(res, 500, true, 'No se pudo actualizar el perfil');
        }
    }


}