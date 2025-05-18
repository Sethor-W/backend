import bcrypt from "bcrypt";
import { sendResponse } from "../../helpers/utils.js";
import { signJWT } from "../../helpers/jwt.helper.js";

// Models
import { UserBusiness } from "../../models/business/usersBusiness.js";
import { UserBusinessRole } from "../../models/business/userBusinessRoles.js";
import { ProfileBusiness } from "../../models/business/profileBusiness.js";
import { Op } from "sequelize";
import { rolesEnum } from "../../enum/roles.enum.js";
import { body, validationResult } from "express-validator";
import { AuthService } from "../../services/business/auth.service.js";

export class AuthBusinessController {

  /**
   * @swagger
   * /api/v1/business/auth/register:
   *   post:
   *     summary: Register a new business user
   *     tags: [Business Auth]
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
   *               - phone
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 description: User email
   *               password:
   *                 type: string
   *                 description: User password
   *               keyword:
   *                 type: string
   *                 description: Keyword for the user
   *               name:
   *                 type: string
   *                 description: User first name
   *               lastname:
   *                 type: string
   *                 description: User last name
   *               rut:
   *                 type: string
   *                 description: User RUT identification
   *               phone:
   *                 type: string
   *                 description: User phone number
   *     responses:
   *       201:
   *         description: User registered successfully
   *       400:
   *         description: Validation errors or invalid data
   *       500:
   *         description: Server error
   */
  // POST business/auth/register
  static async register(req, res) {
    // Validaciones de los campos
    await body('email').isEmail().withMessage('El correo electrónico debe ser válido').run(req);
    await body('password').isString().notEmpty().withMessage('La contraseña es obligatoria').run(req);
    await body('keyword').isString().withMessage('La palabra clave debe ser una cadena').run(req);
    await body('name').isString().withMessage('El nombre debe ser una cadena').run(req);
    await body('lastname').isString().withMessage('El apellido debe ser una cadena').run(req);
    await body('rut').isString().withMessage('El RUT debe ser una cadena').run(req);
    await body('phone').isString().withMessage('El teléfono debe ser una cadena').run(req);

    // Verifica si hay errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendResponse(res, 400, true, 'Errores de validación', errors.array());
    }

    // Extrae los datos de la solicitud
    const { email, password, keyword, name, lastname, rut, phone } = req.body;

    try {
      const result = await AuthService.register({ email, password, keyword, name, lastname, rut, phone });

      if (result.error) {
        return sendResponse(res, 400, true, result.message);
      }

      return sendResponse(res, 201, false, result.message, null, result.data);
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      return sendResponse(res, 500, true, "Error al registrar usuario");
    }
  }


  /**
   * @swagger
   * /api/v1/business/auth/login:
   *   post:
   *     summary: Login a business user
   *     tags: [Business Auth]
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
   *                 description: User email
   *               password:
   *                 type: string
   *                 description: User password
   *     responses:
   *       200:
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
   *                   example: Login exitoso
   *                 data:
   *                   type: object
   *                   properties:
   *                     token:
   *                       type: string
   *                       description: JWT token for authentication
   *       400:
   *         description: Validation errors or invalid credentials
   *       500:
   *         description: Server error
   */
  // POST business/auth/login
  static async login(req, res) {
    // Validaciones de los campos
    await body('email').isEmail().withMessage('El correo electrónico debe ser válido').run(req);
    await body('password').isString().notEmpty().withMessage('La contraseña es obligatoria').run(req);

    // Verifica si hay errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendResponse(res, 400, true, 'Errores de validación', errors.array());
    }

    const { email, password } = req.body;
    try {
      const result = await AuthService.login({ email, password });
      return sendResponse(res, result.statusCode, result.error, result.message, result.data);
    } catch (error) {
      console.error("Error al intentar hacer login:", error);
      return sendResponse(res, 500, true, "Error interno del servidor. Intente nuevamente más tarde.");
    }
  }


  /**
   * @swagger
   * /api/v1/business/auth/jwt:
   *   get:
   *     summary: Get JWT token data
   *     tags: [Business Auth]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       201:
   *         description: JWT data retrieved successfully
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *       500:
   *         description: Server error
   */
  // GET business/auth/jwt
  static async getDataJWT(req, res) {
    try {
      return sendResponse(res, 201, false, 'Datos obtenidos exitosamente', req.user);
    } catch (error) {
      console.error("Error al intentar obtener los datos del JWT:", error);
      return sendResponse(res, 500, true, "Error interno del servidor. Intente nuevamente más tarde.");
    }
  }
}
