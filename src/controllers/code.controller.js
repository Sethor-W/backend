import fs from 'fs';
import path from 'path';
import { generate_6_digitRandomNumericCode, sendResponse, validateEmailFormat, validateRequiredFields } from "../helpers/utils.js";
import { transporter } from '../config/email.config.js';

// Models
import { Profile } from "../models/profile.js";
import { User } from "../models/users.js";
import { Code } from '../models/code.js';


export class CodeController {


    /**
     * Send code to the email of user
     */
    // POST code/email/send
    static async sendCodeToEmail(req, res) {
        try {
            const { email } = req.body;

            // Validar la presencia de los campos requeridos
            const requiredFields = ['email'];
            const missingFields = validateRequiredFields(req.body, requiredFields);
            if (missingFields.length > 0) {
                return sendResponse(res, 400, true, `Los campos son obligatorios: ${missingFields.join(', ')}`);
            }

            // Validar si el email tiene un formato válido
            if (!validateEmailFormat(email)) {
                return sendResponse(res, 400, true, 'El correo electrónico no tiene un formato válido.');
            }


            // Obtén la ruta completa al template HTML 
            const filePath = path.join(process.cwd(), 'src', 'public', 'email_template.html');

            // Lee el contenido del archivo HTML
            const htmlTemplate = fs.readFileSync(filePath, 'utf-8');


            const code = generate_6_digitRandomNumericCode()
            let HTML = htmlTemplate;
            HTML = HTML.replace('{{code}}', code);

            // Enviar mail
            const info = await transporter.sendMail({
                from: `"Sethor" <${process.env.MAIL_FROM}>`, // sender address
                to: `${email}`, // list of receivers
                subject: "Código de verificacion del correo", // Subject line
                text: 'Este es el codigo para acceder a los beneficios de la lista de espera: ' + code, // plain text body
                html: HTML, // html body
            });

            await Code.create({ code, email });

            return sendResponse(res, 200, false, 'Código enviado exitosamente');
        } catch (error) {
            console.error('Error al enviar el codigo al correo:', error);
            return sendResponse(res, 500, true, 'Error al enviar el codigo al correo');
        }
    }


    /**
     * Verificar codigo enviado al email del usuario
     */
    // POST code/email/verify
    static async verifyCodeSentToEmail(req, res) {
        try {
            const { email, code } = req.body;

            // Validar la presencia de los campos requeridos
            const requiredFields = ['email', 'code'];
            const missingFields = validateRequiredFields(req.body, requiredFields);
            if (missingFields.length > 0) {
                return sendResponse(res, 400, true, `Los campos son obligatorios: ${missingFields.join(', ')}`);
            }

            // Validar si el email tiene un formato válido
            if (!validateEmailFormat(email)) {
                return sendResponse(res, 400, true, 'El correo electrónico no tiene un formato válido.');
            }

            // Verificar si el codigo esta en la base de datos
            const codeExists = await Code.findOne({
                where: {
                    email: email,
                    code: code
                }
            });
            if (!codeExists) {
                return sendResponse(res, 400, true, 'Codigo invalido');
            }

            // Si el código existe, elimínalo de la base de datos
            await codeExists.destroy();

            return sendResponse(res, 200, false, 'Código verificado exitosamente');
        } catch (error) {
            console.error('Error al verificar el codigo: ', error);
            return sendResponse(res, 500, true, 'Error al verificar el codigo');
        }
    }

}