import fs from 'fs';
import path from 'path';
import { generate_6_digitRandomNumericCode, sendResponse, validateEmailFormat, validateRequiredFields } from "../helpers/utils.js";
import { transporter } from '../config/email.config.js';

// Models
import { Profile } from "../models/client/profile.js";
import { User } from "../models/client/users.js";
import { Code } from '../models/code.js';


export class CodeController {


    /**
     * @swagger
     * /api/v1/code/email/send:
     *   post:
     *     summary: Send verification code to email
     *     tags: [Verification]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 description: Email to send verification code
     *     responses:
     *       200:
     *         description: Code sent successfully
     *       400:
     *         description: Missing required fields or invalid email format
     *       500:
     *         description: Server error
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
     * @swagger
     * /api/v1/code/email/verify:
     *   post:
     *     summary: Verify email code
     *     tags: [Verification]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - code
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 description: Email to verify
     *               code:
     *                 type: string
     *                 description: Verification code sent to email
     *     responses:
     *       200:
     *         description: Code verified successfully
     *       400:
     *         description: Missing required fields, invalid email format, or invalid code
     *       500:
     *         description: Server error
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