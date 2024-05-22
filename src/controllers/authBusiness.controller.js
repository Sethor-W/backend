import bcrypt from "bcrypt";
import {
  sendResponse,
  validateEmailFormat,
  validateRequiredFields,
} from "../helpers/utils.js";
import { signJWT } from "../helpers/jwt.helper.js";

// Models
import { UserBusiness } from "../models/usersBusiness.js";
import { UserBusinessRole } from "../models/userBusinessRoles.js";
import { ProfileBusiness } from "../models/profileBusiness.js";
import { Op } from "sequelize";
import { rolesEnum } from "../enum/roles.enum.js";

export class AuthBusinessController {
  /**
   * Register a user
   */
  // POST business/auth/register
  static async register(req, res) {
    try {
      const { email, password, keyword, name, lastname, rut, phone } = req.body;

      // Validar la presencia de los campos requeridos
      const requiredFields = [
        "email",
        "password",
        "keyword",
        "name",
        "lastname",
        "rut",
        "phone",
      ];
      const missingFields = validateRequiredFields(req.body, requiredFields);
      if (missingFields.length > 0) {
        return sendResponse(
          res,
          400,
          true,
          `The fields are required: ${missingFields.join(", ")}`
        );
      }

      // Validar si el email tiene un formato válido
      if (!validateEmailFormat(email)) {
        return sendResponse(
          res,
          400,
          true,
          "The email does not have a valid format"
        );
      }

      // Verificar si el nombre de usuario ya existe
      const existingUser = await UserBusiness.findOne({
        where: {
          [Op.or]: [{ email }, { credential: `${rut}.${keyword}` }],
        },
      });
      if (existingUser) {
        return sendResponse(
          res,
          400,
          true,
          "Email or credential is already in use"
        );
      }

      // Buscar el rol "owner" en la tabla de roles
      const ownerRole = await UserBusinessRole.findOne({
        where: { role: rolesEnum.OWNER },
      });

      // Crear un nuevo usuario
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUserBusiness = await UserBusiness.create({
        email,
        password: hashedPassword,
        keyword: keyword,
        credential: `${rut}.${keyword}`,
        userBusinessRoleId: ownerRole.id,
      });

      // Registrar perfil del usuario
      const newProfile = await ProfileBusiness.create({
        name,
        lastname,
        rut,
        phone,
        usersBusinessId: newUserBusiness.id,
      });

      // Generar token de autenticación
      const token = signJWT({
        userId: newUserBusiness.id,
        role: ownerRole.role,
      });

      return sendResponse(res, 201, false, "Registred", null, {
        token: token,
        role: ownerRole.role,
      });
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
        return sendResponse(res, 401, true, "Invalid credentials");
      }

      // Verificar la contraseña
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return sendResponse(res, 401, true, "Invalid credentials");
      }

      // Obtener rol del usuario
      const role = await UserBusinessRole.findOne({
        where: { id: user.userBusinessRoleId },
      });

      // Generar token de autenticación
      const token = signJWT({ userId: user.id, role: role.role });

      return sendResponse(res, 201, false, "Successful login", null, {
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

          return sendResponse(res, 201, false, 'Get data', {role, userId});
      } catch (error) {
          console.error('Error al obtener la información:', error);
          res.status(500).json({ error: 'Error al obtener la información' });
      }
  }
}
