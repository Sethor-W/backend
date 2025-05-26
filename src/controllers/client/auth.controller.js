import bcrypt from "bcrypt";
import {
    generateUniqueCode,
    sendResponse,
    validateEmailFormat,
    validateRequiredFields,
} from "../../helpers/utils.js";
import { signJWT } from "../../helpers/jwt.helper.js";

// Models
import { Profile } from "../../models/client/profile.js";
import { User } from "../../models/client/users.js";

export class AuthController {
    /**
     * @swagger
     * /api/v1/auth/register:
     *   post:
     *     summary: Register a new user
     *     tags: [Authentication]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *               - name
     *               - lastname
     *               - rut
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 description: User email
     *               password:
     *                 type: string
     *                 format: password
     *                 description: User password
     *               name:
     *                 type: string
     *                 description: User's first name
     *               lastname:
     *                 type: string
     *                 description: User's last name
     *               rut:
     *                 type: string
     *                 description: User's identification number
     *     responses:
     *       201:
     *         description: Registration successful
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
     *                   example: Registrado
     *                 data:
     *                   type: object
     *                   properties:
     *                     user:
     *                       type: object
     *                       properties:
     *                         id:
     *                           type: integer
     *                         email:
     *                           type: string
     *                 token:
     *                   type: string
     *       400:
     *         description: Bad request - Missing fields or email already in use
     *       500:
     *         description: Server error
     */
    // POST auth/register
    static async register(req, res) {
        try {
            const { email, password, name, lastname, rut } = req.body;

            // Validar la presencia de los campos requeridos
            const requiredFields = ["email", "password", "name", "lastname", "rut"];
            const missingFields = validateRequiredFields(req.body, requiredFields);
            if (missingFields.length > 0) {
                return sendResponse(res, 400, true, `Los campos son obligatorios: ${missingFields.join(", ")}`);
            }

            // Validar si el email tiene un formato válido
            if (!validateEmailFormat(email)) {
                return sendResponse(res, 400, true, "El correo electrónico no tiene un formato válido.");
            }

            // Verificar si el nombre de usuario ya existe
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return sendResponse(res, 400, true, "Correo electrónico ya está en uso");
            }

            // Crear un nuevo usuario
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({ email, password: hashedPassword });

            // Registrar perfil del usuario
            const newProfile = await Profile.create({
                name,
                codeUser: generateUniqueCode(),
                lastname,
                rut,
                userId: newUser.id,
            });

            // Generar token de autenticación
            const token = signJWT({ userId: newUser.id });

            return sendResponse(
                res,
                201,
                false,
                "Registrado",
                {
                    user: {
                        id: newUser.id,
                        email: newUser.email,
                    },
                },
                { token: token }
            );
        } catch (error) {
            console.error("Error al registrar usuario:", error);
            return sendResponse(res, 500, true, "Error al registrar usuario");
        }
    }

    /**
     * @swagger
     * /api/v1/auth/login:
     *   post:
     *     summary: Login user
     *     tags: [Authentication]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 description: User email
     *               password:
     *                 type: string
     *                 format: password
     *                 description: User password
     *     responses:
     *       201:
     *         description: Login successful
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
     *                   example: Acceso exitoso
     *                 data:
     *                   type: object
     *                   properties:
     *                     user:
     *                       type: object
     *                       properties:
     *                         id:
     *                           type: integer
     *                         email:
     *                           type: string
     *                 token:
     *                   type: string
     *       401:
     *         description: Invalid credentials
     *       500:
     *         description: Server error
     */
    // POST auth/login
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            // Verificar si el usuario existe
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return sendResponse(res, 401, true, "Credenciales no válidas");
            }

            // Verificar la contraseña
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return sendResponse(res, 401, true, "Credenciales no válidas");
            }

            // Generar token de autenticación
            const token = signJWT({ userId: user.id });

            return sendResponse(
                res,
                201,
                false,
                "Acceso exitoso",
                {
                    user: {
                        id: user.id,
                        email: user.email,
                    },
                },
                { token: token }
            );
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            res.status(500).json({ error: "Error al iniciar sesión" });
        }
    }


    /**
     * @swagger
     * /api/v1/auth/google:
     *   post:
     *     summary: Authenticate with Google
     *     tags: [Authentication]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - token
     *             properties:
     *               token:
     *                 type: string
     *                 description: Google authentication token
     *     responses:
     *       200:
     *         description: Authentication successful
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 token:
     *                   type: string
     *                   description: JWT authentication token
     *       401:
     *         description: Invalid token
     *       500:
     *         description: Server error
     */
    // POST auth/google
    static async authGoogle(req, res) {

    }

}
