import { sendResponse } from "../../helpers/utils.js";
import { Profile } from "../../models/client/profile.js";
import { User } from "../../models/client/users.js";


export class ProfileController {


    /**
     * @swagger
     * /api/v1/users/profile/{userId}:
     *   get:
     *     summary: Get user profile by ID
     *     tags: [User Profile]
     *     parameters:
     *       - in: path
     *         name: userId
     *         required: true
     *         schema:
     *           type: string
     *         description: User ID
     *     responses:
     *       200:
     *         description: Profile retrieved successfully
     *       404:
     *         description: Profile not found
     *       500:
     *         description: Server error
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
     * @swagger
     * /api/v1/users/profile:
     *   get:
     *     summary: Get profile of authenticated user
     *     tags: [User Profile]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Profile retrieved successfully
     *       404:
     *         description: Profile not found
     *       500:
     *         description: Server error
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
     * @swagger
     * /api/v1/users/profile:
     *   put:
     *     summary: Update user profile
     *     tags: [User Profile]
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
     *               hand:
     *                 type: string
     *                 description: Hand to update
     *                 enum:
     *                   - right
     *                   - left
     *     responses:
     *       200:
     *         description: Profile updated successfully
     *       404:
     *         description: Profile not found
     *       500:
     *         description: Server error
     */
    // PUT /users/profile
    static async updateUserProfile(req, res) {
        const { userId } = req.user;
        const { phone, profilePicture, hand } = req.body;

        try {
            // Buscar el perfil del usuario por el userId
            const profile = await Profile.findOne({ where: { userId } });  

            if (!profile) {
                return sendResponse(res, 404, true, "Perfil no encontrado");
            }

            // Actualizar solo los campos que se envían en el request
            if (phone) profile.phone = phone;
            if (profilePicture) profile.profilePicture = profilePicture;

            if (hand === "right") {
                profile.handRight = true;
            } else if (hand === "left") {
                profile.handLeft = true;
            }

            // Guardar los cambios en la base de datos
            await profile.save();

            return sendResponse(res, 200, false, 'Perfil actualizado exitosamente', profile);
        } catch (error) {
            console.error('Error al actualizar el perfil de usuario:', error);
            return sendResponse(res, 500, true, 'No se pudo actualizar el perfil');
        }
    }


}