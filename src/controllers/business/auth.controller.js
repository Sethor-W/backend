import bcrypt from "bcrypt";
import {
  sendResponse,
  validateEmailFormat,
  validateRequiredFields,
} from "../../helpers/utils.js";
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

      // // Validar la presencia de los campos requeridos
      // const requiredFields = [
      //   "email",
      //   "password",
      //   "keyword",
      //   "name",
      //   "lastname",
      //   "rut",
      //   "phone",
      // ];
      // const missingFields = validateRequiredFields(req.body, requiredFields);
      // if (missingFields.length > 0) {
      //   return sendResponse(
      //     res,
      //     400,
      //     true,
      //     `Los campos son obligatorios: ${missingFields.join(", ")}`
      //   );
      // }

      // // Validar si el email tiene un formato válido
      // if (!validateEmailFormat(email)) {
      //   return sendResponse(
      //     res,
      //     400,
      //     true,
      //     "El correo electrónico no tiene un formato válido."
      //   );
      // }

      // Verificar si el nombre de usuario ya existe
      
      // Llamada al servicio de registro
      
      const result = await AuthService.register({ email, password, keyword, name, lastname, rut, phone });

      if (result.error) {
        return sendResponse(res, 400, true, result.message);
      }
  
      return sendResponse(res, 201, false, result.message, null, result.data);

      // const existingUser = await UserBusiness.findOne({
      //   where: {
      //     [Op.or]: [{ email }, { credential: `${rut}.${keyword}` }],
      //   },
      // });
      // if (existingUser) {
      //   return sendResponse(
      //     res,
      //     400,
      //     true,
      //     "El correo electrónico o la credencial ya están en uso"
      //   );
      // }

      // // Buscar el rol "owner" en la tabla de roles
      // const ownerRole = await UserBusinessRole.findOne({
      //   where: { role: rolesEnum.OWNER },
      // });

      // // Crear un nuevo usuario
      // const hashedPassword = await bcrypt.hash(password, 10);
      // const newUserBusiness = await UserBusiness.create({
      //   email,
      //   password: hashedPassword,
      //   keyword: keyword,
      //   credential: `${rut}.${keyword}`,
      //   userBusinessRoleId: ownerRole.id,
      // });

      // // Registrar perfil del usuario
      // const newProfile = await ProfileBusiness.create({
      //   name,
      //   lastname,
      //   rut,
      //   phone,
      //   usersBusinessId: newUserBusiness.id,
      // });

      // // Generar token de autenticación
      // const token = signJWT({
      //   userId: newUserBusiness.id,
      //   role: ownerRole.role,
      // });

      // return sendResponse(res, 201, false, "Registrado", null, {
      //   token: token,
      //   role: ownerRole.role,
      // });
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
    try {
      const { credential, password } = req.body;

      // Verificar si el usuario existe
      const user = await UserBusiness.findOne({ where: { credential } });
      if (!user) {
        return sendResponse(res, 401, true, "Credenciales no válidas");
      }

      // Verificar la contraseña
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return sendResponse(res, 401, true, "Credenciales no válidas");
      }

      // Obtener rol del usuario
      const role = await UserBusinessRole.findOne({
        where: { id: user.userBusinessRoleId },
      });

      // Generar token de autenticación
      const token = signJWT({ userId: user.id, role: role.role });

      return sendResponse(res, 201, false, "Acceso exitoso", null, {
        role: role.role,
        token: token,
      });
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      res.status(500).json({ error: "Error al iniciar sesión" });
    }
  }

  /**
   * Get data of JWT
  */
  // GET business/auth/jwt
  static async getDataJWT(req, res) {
      try {
          const {role, userId} = req.user;

          return sendResponse(res, 201, false, 'Datos obtenidos exitosamente', {role, userId});
      } catch (error) {
          console.error('Error al obtener la información:', error);
          res.status(500).json({ error: 'Error al obtener la información' });
      }
  }
}
