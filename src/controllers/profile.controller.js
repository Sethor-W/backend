
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
                return sendResponse(res, 404, true, "Perfil no encontrado");
            }

            return sendResponse(res, 200, false, 'Perfil recuperado exitosamente', profile);
        } catch (error) {
            console.error('Error al recuperar el perfil de usuario:', error);
            return sendResponse(res, 500, true, 'No se pudo recuperar el perfil');
        }
    }



}