import { sendResponse } from "../helpers/utils.js";
import { ProfileBusiness } from "../models/business/profileBusiness.js";
import { UserBusinessRole } from "../models/business/userBusinessRoles.js";
import { UserBusiness } from "../models/business/usersBusiness.js";


export class ProfileBusinessController {


    /**
     * @swagger
     * /api/v1/business/users/profile:
     *   get:
     *     summary: Get business user profile
     *     tags: [Business Profile]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Profile retrieved successfully
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
     *                   example: Perfil recuperado exitosamente
     *                 data:
     *                   type: object
     *                   properties:
     *                     id:
     *                       type: string
     *                     email:
     *                       type: string
     *                     status:
     *                       type: string
     *                     profiles_business:
     *                       type: object
     *                       properties:
     *                         id:
     *                           type: string
     *                         name:
     *                           type: string
     *                         lastname:
     *                           type: string
     *                         phone:
     *                           type: string
     *                         additionalData:
     *                           type: object
     *       404:
     *         description: Profile not found
     *       500:
     *         description: Server error
     */
    // GET business/users/profile
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
     * @swagger
     * /api/v1/business/users/profile:
     *   put:
     *     summary: Update business user profile
     *     tags: [Business Profile]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               phone:
     *                 type: string
     *                 description: User phone number
     *               profilePicture:
     *                 type: string
     *                 description: URL to profile picture
     *     responses:
     *       200:
     *         description: Profile updated successfully
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
     *                   example: Perfil actualizado exitosamente
     *                 data:
     *                   type: object
     *       404:
     *         description: Profile not found
     *       500:
     *         description: Server error
     */
    // PUT /business/users/profile
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