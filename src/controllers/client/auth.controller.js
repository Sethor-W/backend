import bcrypt from "bcrypt";
import {
    generateUniqueCode,
    sendResponse,
    validateEmailFormat,
    validateRequiredFields,
} from "../../helpers/utils.js";
import { signJWT } from "../../helpers/jwt.helper.js";
import admin from "../../config/firebase.config.js";

export class AuthController {
    /**
     * Register a user
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
            const usersRef = admin.firestore().collection('users');
            const snapshot = await usersRef.where('email', '==', email).get();
            if (!snapshot.empty) {
                return sendResponse(res, 400, true, "Correo electrónico ya está en uso");
            }

            // Crear un nuevo usuario en Firestore
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUserRef = await usersRef.add({ 
                email, 
                password: hashedPassword,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });

            // Registrar perfil del usuario
            const profilesRef = admin.firestore().collection('profiles');
            const profileData = {
                name,
                codeUser: generateUniqueCode(),
                lastname,
                rut,
                userId: newUserRef.id,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            };
            await profilesRef.doc(newUserRef.id).set(profileData);

            // Generar token de autenticación
            const token = signJWT({ userId: newUserRef.id });

            return sendResponse(
                res,
                201,
                false,
                "Registrado",
                {
                    user: {
                        id: newUserRef.id,
                        email: email
                    },
                },
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
    // POST auth/login
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            // Verificar si el usuario existe
            const usersRef = admin.firestore().collection('users');
            const snapshot = await usersRef.where('email', '==', email).get();
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

            // Generar token de autenticación
            const token = signJWT({ userId: userDoc.id });

            return sendResponse(
                res,
                200,
                false,
                "Acceso exitoso",
                {
                    user: {
                        id: userDoc.id,
                        email: userData.email
                    },
                },
                { token }
            );
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            return sendResponse(res, 500, true, "Error al iniciar sesión");
        }
    }

}
