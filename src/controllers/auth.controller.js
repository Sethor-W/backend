import bcrypt from 'bcrypt';
import { sendResponse, validateEmailFormat, validateRequiredFields } from "../helpers/utils.js";
import { signJWT } from "../helpers/jwt.helper.js"

// Models
import { Profile } from "../models/profile.js";
import { User } from "../models/users.js";


export class AuthController {


    /**
     * Register a user
     */
    // POST auth/register
    static async register(req, res) {
        try {
            const { email, password, name, lastname, rut, phone } = req.body;

            // Validar la presencia de los campos requeridos
            const requiredFields = ['email', 'password', 'name', 'lastname', 'rut', 'phone'];
            const missingFields = validateRequiredFields(req.body, requiredFields);
            if (missingFields.length > 0) {
                return sendResponse(res, 400, true, `The fields are required: ${missingFields.join(', ')}`);
            }

            // Validar si el email tiene un formato válido
            if (!validateEmailFormat(email)) {
                return sendResponse(res, 400, true, 'The email does not have a valid format');
            }

            // Verificar si el nombre de usuario ya existe
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return sendResponse(res, 400, true, 'Email is already in use');
            }

            // Crear un nuevo usuario
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({ email, password: hashedPassword });

            // Registrar perfil del usuario
            const newProfile = await Profile.create({name, codeUser: "778-M", lastname, rut, phone, userId: newUser.id });

            // Generar token de autenticación
            const token = signJWT({ userId: newUser.id });

            return sendResponse(res, 201, false, 'Registred', null, { token: token });
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            return sendResponse(res, 500, true, 'Error al registrar usuario');
        }
    }

    /**
     * Login a user
     */
    // POST auth/login
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            // Verificar si el usuario existe
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return sendResponse(res, 401, true, 'Invalid credentials');
            }

            // Verificar la contraseña
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return sendResponse(res, 401, true, 'Invalid credentials');
            }

            // Generar token de autenticación
            const token = signJWT({ userId: user.id });

            return sendResponse(res, 201, false, 'Successful login', null, { token: token });
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            res.status(500).json({ error: 'Error al iniciar sesión' });
        }
    }

}