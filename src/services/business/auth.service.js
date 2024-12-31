// src/services/auth.service.js
import bcrypt from "bcrypt";
import { UserBusiness } from "../../models/business/usersBusiness.js";
import { UserBusinessRole } from "../../models/business/userBusinessRoles.js";
import { ProfileBusiness } from "../../models/business/profileBusiness.js";
import { rolesEnum } from "../../enum/roles.enum.js";
import { signJWT } from "../../helpers/jwt.helper.js";
import { validateEmailFormat } from "../../helpers/utils.js";
import { Op } from "sequelize";
import { sequelize } from "../../config/database.config.js";

export class AuthService {

    /**
     * Registro de un nuevo usuario
     * @param {Object} userData - Los datos del usuario a registrar
     * @returns {Object} Resultado del registro
     */
    static async register(userData) {
        const { email, password, keyword, name, lastname, rut, phone } = userData;

        // Comenzamos la transacción para asegurar la integridad de los datos
        const t = await sequelize.transaction();

        try {
            
            // Verificar si el nombre de usuario ya existe
            const existingUser = await UserBusiness.findOne({
                where: {
                    [Op.or]: [{ email }, { credential: `${rut}.${keyword}` }],
                },
                transaction: t,
            });
            if (existingUser) {
                return { error: true, message: 'El correo electrónico o la credencial ya están en uso' };
            }

            // Buscar el rol "owner" en la tabla de roles
            const ownerRole = await UserBusinessRole.findOne({
                where: { role: rolesEnum.OWNER },
                transaction: t,
            });

            // Crear un nuevo usuario
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUserBusiness = await UserBusiness.create({
                email,
                password: hashedPassword,
                keyword,
                credential: `${rut}.${keyword}`,
                userBusinessRoleId: ownerRole.id,
            }, {transaction: t});

            // Registrar perfil del usuario
            const newProfile = await ProfileBusiness.create({
                name,
                lastname,
                rut,
                phone,
                usersBusinessId: newUserBusiness.id,
            }, { transaction: t });
            console.log(newProfile)

            // Commit de la transacción
            await t.commit();

            // Generar token de autenticación
            const token = signJWT({
                userId: newUserBusiness.id,
                role: ownerRole.role,
            });

            return {
                error: false,
                message: 'Registrado exitosamente',
                data: {
                    token,
                    role: ownerRole.role,
                },
            };

        } catch (error) {
            // Si hay un error, hacemos rollback de la transacción
            await t.rollback()
            console.error('Error al registrar usuario:', error);
            return { error: true, message: `Error al registrar usuario: ${error}` };
        }
    }

    // Iniciar sesión de un usuario
    static async login({ credential, password }) {
        // Verificar si el usuario existe
        const user = await UserBusiness.findOne({ where: { credential } });
        if (!user) {
            throw new Error("Credenciales no válidas");
        }

        // Verificar la contraseña
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new Error("Credenciales no válidas");
        }

        // Obtener rol del usuario
        const role = await UserBusinessRole.findOne({
            where: { id: user.userBusinessRoleId },
        });

        // Generar token de autenticación
        const token = signJWT({ userId: user.id, role: role.role });

        return { role: role.role, token };
    }

    // Obtener los datos del JWT
    static getDataJWT(user) {
        return { role: user.role, userId: user.userId };
    }
    
}
