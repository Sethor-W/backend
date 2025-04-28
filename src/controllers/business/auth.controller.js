import bcrypt from "bcrypt";
import { sendResponse, generateUniqueCode } from "../../helpers/utils.js";
import { signJWT } from "../../helpers/jwt.helper.js";
import admin from "../../config/firebase.config.js";
import { body, validationResult } from "express-validator";

// Roles enumerados
const BUSINESS_ROLES = {
  ADMIN: 1,
  OWNER: 2,
  MANAGER: 3,
  EMPLOYEE: 4,
  CUSTOMER: 5
};

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
      // Verificar si el correo electrónico ya existe
      const usersRef = admin.firestore().collection('business_users');
      const snapshot = await usersRef.where('email', '==', email).get();
      if (!snapshot.empty) {
        return sendResponse(res, 400, true, "Correo electrónico ya está en uso");
      }

      // Crear un nuevo usuario en Firestore
      const hashedPassword = await bcrypt.hash(password, 10);
      const userCode = generateUniqueCode();
      
      const newUserRef = await usersRef.add({ 
        email, 
        password: hashedPassword,
        keyword,
        userCode,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Registrar perfil del usuario
      const profilesRef = admin.firestore().collection('business_profiles');
      const profileData = {
        name,
        lastname,
        rut,
        phone,
        userId: newUserRef.id,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };
      await profilesRef.doc(newUserRef.id).set(profileData);

      // Registrar rol del usuario (OWNER = 2)
      const rolesRef = admin.firestore().collection('business_user_roles');
      await rolesRef.add({
        userId: newUserRef.id,
        roleId: BUSINESS_ROLES.OWNER,
        roleName: 'OWNER',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Generar token de autenticación
      const token = signJWT({ 
        userId: newUserRef.id, 
        userType: 'business',
        roleId: BUSINESS_ROLES.OWNER
      });

      return sendResponse(
        res, 
        201, 
        false, 
        "Usuario de negocio registrado exitosamente", 
        null, 
        { token }
      );
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
    await body('userCode').isString().withMessage('El código de usuario debe ser una cadena').run(req);
    await body('password').isString().notEmpty().withMessage('La contraseña es obligatoria').run(req);

    // Verifica si hay errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendResponse(res, 400, true, 'Errores de validación', errors.array());
    }

    const { userCode, password } = req.body;
    try {
      // Verificar si el usuario existe
      const usersRef = admin.firestore().collection('business_users');
      const snapshot = await usersRef.where('userCode', '==', userCode).get();
      
      if (snapshot.empty) {
        return sendResponse(res, 401, true, "Credenciales no válidas");
      }

      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();

      // Verificar la contraseña
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (!passwordMatch) {
        return sendResponse(res, 401, true, "Credenciales no válidas");
      }

      // Obtener perfil del usuario
      const profileRef = admin.firestore().collection('business_profiles').doc(userDoc.id);
      const profileDoc = await profileRef.get();
      
      if (!profileDoc.exists) {
        return sendResponse(res, 404, true, "Perfil de usuario no encontrado");
      }
      
      const profileData = profileDoc.data();

      // Obtener roles del usuario
      const rolesRef = admin.firestore().collection('business_user_roles');
      const rolesSnapshot = await rolesRef.where('userId', '==', userDoc.id).get();
      
      if (rolesSnapshot.empty) {
        return sendResponse(res, 403, true, "Usuario sin roles asignados");
      }
      
      const roleData = rolesSnapshot.docs[0].data();

      // Generar token de autenticación
      const token = signJWT({ 
        userId: userDoc.id, 
        userType: 'business',
        roleId: roleData.roleId
      });

      return sendResponse(
        res,
        200,
        false,
        "Acceso exitoso",
        {
          user: {
            id: userDoc.id,
            email: userData.email,
            userCode: userData.userCode,
            name: profileData.name,
            lastname: profileData.lastname,
            roleId: roleData.roleId,
            roleName: roleData.roleName
          }
        },
        { token }
      );
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
      // Si se necesita información adicional del usuario desde Firestore
      if (req.user && req.user.userId) {
        // Obtener datos del usuario
        const userRef = admin.firestore().collection('business_users').doc(req.user.userId);
        const userDoc = await userRef.get();
        
        if (!userDoc.exists) {
          return sendResponse(res, 404, true, "Usuario no encontrado");
        }
        
        const userData = userDoc.data();
        delete userData.password; // Eliminar datos sensibles
        
        // Obtener perfil
        const profileRef = admin.firestore().collection('business_profiles').doc(req.user.userId);
        const profileDoc = await profileRef.get();
        const profileData = profileDoc.exists ? profileDoc.data() : {};
        
        // Obtener rol
        const rolesRef = admin.firestore().collection('business_user_roles');
        const rolesSnapshot = await rolesRef.where('userId', '==', req.user.userId).get();
        const roleData = !rolesSnapshot.empty ? rolesSnapshot.docs[0].data() : {};
        
        // Combinar con los datos del JWT
        const userInfo = {
          ...req.user,
          ...userData,
          profile: profileData,
          role: {
            id: roleData.roleId,
            name: roleData.roleName
          }
        };
        
        return sendResponse(res, 200, false, 'Datos obtenidos exitosamente', userInfo);
      } else {
        return sendResponse(res, 401, true, 'Token inválido o expirado');
      }
    } catch (error) {
      console.error("Error al intentar obtener los datos del JWT:", error);
      return sendResponse(res, 500, true, "Error interno del servidor. Intente nuevamente más tarde.");
    }
  }
}
