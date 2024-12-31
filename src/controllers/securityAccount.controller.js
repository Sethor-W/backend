import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import {
    comparePassword,
    generate_6_digitRandomNumericCode,
    sendResponse,
    validateRequiredFields
} from "../helpers/utils.js";

// Models
import {
    User
} from "../models/client/users.js";
import { transporter } from '../config/email.config.js';
import { Op } from 'sequelize';


export class SecurityAccountController {

    /**
     * Generate code to change the password
     */
    // POST security/send-reset-password-code
    static async sendResetPasswordCode(req, res) {
        const { email } = req.body;

        try {
            // Validar la presencia de los campos requeridos
            const requiredFields = ['email'];
            const missingFields = validateRequiredFields(req.body, requiredFields);
            if (missingFields.length > 0) {
                return sendResponse(res, 400, true, `Los campos son obligatorios: ${missingFields.join(', ')}`);
            }

            const user = await User.findOne({ where: { email } });

            if (!user) {
                return sendResponse(res, 404, true, "Usuario no encontrado");
            }

            const resetPasswordCode = generate_6_digitRandomNumericCode();
            user.resetPasswordCode = resetPasswordCode;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
            await user.save();


            // Obtén la ruta completa al template HTML 
            const filePath = path.join(process.cwd(), 'src', 'public', 'reset_password_template.html');
            // Lee el contenido del archivo HTML
            const htmlTemplate = fs.readFileSync(filePath, 'utf-8');

            let HTML = htmlTemplate;
            HTML = HTML.replace('{{resetPasswordCode}}', resetPasswordCode);

            // Enviar mail
            const info = await transporter.sendMail({
                from: `"Sethor" <${process.env.MAIL_FROM}>`, // sender address
                to: `${user.email}`, // list of receivers
                subject: "Código de restablecimiento de contraseña", // Subject line
                html: HTML, // html body
            });

            return sendResponse(res, 200, false, "Código de restablecimiento enviado al correo");
        } catch (err) {
            console.error('Error: ', err);
            return sendResponse(res, 500, true, "Internal server error");
        }
    }

    /**
     * Reset password
     */
    // PUT security/reset-password
    static async resetPassword(req, res) {
        const { email, code, newPassword } = req.body;

        try {
            // Validar la presencia de los campos requeridos
            const requiredFields = ['email', 'code', 'newPassword'];
            const missingFields = validateRequiredFields(req.body, requiredFields);
            if (missingFields.length > 0) {
                return sendResponse(res, 400, true, `Los campos son obligatorios: ${missingFields.join(', ')}`);
            }

            const user = await User.findOne({
                where: {
                  email: email,
                  resetPasswordCode: code,
                  resetPasswordExpires: {
                    [Op.gt]: Date.now(),
                  },
                },
            });

            if (!user) {
                return sendResponse(res, 404, true, "Código de reinicio no válido o caducado.");
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            user.resetPasswordCode = null;
            user.resetPasswordExpires = null;
            await user.save();

            return sendResponse(res, 200, false, "Contraseña se ha restablecida con exito");
        } catch (err) {
            console.error('Error: ', err);
            return sendResponse(res, 500, true, "Internal server error");
        }
    }


    /**
     * Change password
     */
    // PUT security/change-password
    static async changePassword(req, res) {
        const { currentPassword, newPassword, code } = req.body;
        const { userId } = req.user;

        try {
            // Validar la presencia de los campos requeridos
            const requiredFields = ['currentPassword', 'newPassword', 'code'];
            const missingFields = validateRequiredFields(req.body, requiredFields);
            if (missingFields.length > 0) {
                return sendResponse(res, 400, true, `Los campos son obligatorios: ${missingFields.join(', ')}`);
            }

            // Busca al usuario por su ID
            const user = await User.findByPk(userId);
            if (!user) {
                return sendResponse(res, 404, true, 'Usuario no encontrado');
            }

            const userCode = await User.findOne({
                where: {
                  email: user.email,
                  resetPasswordCode: code,
                  resetPasswordExpires: {
                    [Op.gt]: Date.now(),
                  },
                },
            });
            if (!userCode) {
                return sendResponse(res, 404, true, 'Código de reinicio no válido o caducado.');
            }

            // Verifica si la contraseña actual es correcta
            const correctPassword = await comparePassword(currentPassword, user.password);
            if (!correctPassword) {
                return sendResponse(res, 401, true, 'Contraseña actual incorrecta');
            }

            // Verifica si la contraseña actual es correcta
            const validateNewPassword = await comparePassword(newPassword, user.password);
            if (validateNewPassword) {
                return sendResponse(res, 401, true, 'La contraseña nueva no puede ser igual a la actual');
            }

            // Actualiza la contraseña del usuario
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();

            return sendResponse(res, 201, false, 'Contraseña actualizada exitosamente');
        } catch (err) {
            console.error('Error al cambiar la contraseña:', err);
            return sendResponse(res, 500, true, 'Error al cambiar la contraseña');
        }
    }

}