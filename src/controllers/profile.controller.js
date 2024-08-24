
import { sendResponse } from "../helpers/utils.js";
import { Profile } from "../models/profile.js";
import { User } from "../models/users.js";


export class ProfileController {


    /**
     * Obtener el perfil del usuario
     */
    // GET users/profile/:id
    static async getUserProfileById(req, res) {
        const { id } = req.params;
        try {
            
            const profile = await User.findByPk(id, {
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


    /**
     * Obtener el perfil del usuario
     */
    // GET users/profile
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


    /**
     * Actualizar el perfil del usuario
     */
    // PUT /users/profile
    static async updateUserProfile(req, res) {
        const { userId } = req.user;
        const { phone, profilePicture } = req.body;

        try {
            // Buscar el perfil del usuario por el userId
            const profile = await Profile.findOne({ where: { userId } });  

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