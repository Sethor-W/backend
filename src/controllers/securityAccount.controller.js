import bcrypt from 'bcrypt';
import { comparePassword, sendResponse } from "../helpers/utils.js";

// Models
import { User } from "../models/users.js";


export class SecurityAccountController {


    /**
     * Change password
     */
    // PUT security/change-password
    static async changePassword(req, res) {
        const { currentPassword, newPassword } = req.body;
        const { userId } = req.user;
        try {
            // Busca al usuario por su ID
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ mensaje: 'User not found' });
            }

            // Verifica si la contraseña actual es correcta
            const correctPassword = await comparePassword(currentPassword, user.password);
            if (!correctPassword) {
                return res.status(401).json({ mensaje: 'Incorrect current password' });
            }

            // Actualiza la contraseña del usuario
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();

            return sendResponse(res, 201, false, 'Password updated successfully');
        } catch (error) {
            console.error('Error al cambiar la contraseña:', error);
            res.status(500).json({ error: 'Error al cambiar la contraseña' });
        }
    }

}