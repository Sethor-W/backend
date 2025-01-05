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
   * Register a user
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
   * Login a user
   */
  // POST business/auth/login
  static async login(req, res) {
    // Validaciones de los campos
    await body('userCode').isString().withMessage('La palabra clave debe ser una cadena').run(req);
    await body('password').isString().notEmpty().withMessage('La contraseña es obligatoria').run(req);

    // Verifica si hay errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendResponse(res, 400, true, 'Errores de validación', errors.array());
    }

    const { userCode, password } = req.body;
    try {
      const result = await AuthService.login({ userCode, password });
      return sendResponse(res, result.statusCode, result.error, result.message, result.data);
    } catch (error) {
      console.error("Error al intentar hacer login:", error);
      return sendResponse(res, 500, true, "Error interno del servidor. Intente nuevamente más tarde.");
    }
  }


  /**
   * Get data of JWT
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
