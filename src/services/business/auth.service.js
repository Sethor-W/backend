// src/services/auth.service.js
import bcrypt from "bcrypt";
import { UserBusiness } from "../../models/business/usersBusiness.js";
import { UserBusinessRole } from "../../models/business/userBusinessRoles.js";
import { ProfileBusiness } from "../../models/business/profileBusiness.js";
import { rolesEnum } from "../../enum/roles.enum.js";
import { signJWT } from "../../helpers/jwt.helper.js";
import { Op } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import { EmployeesAssociatedBusinesses } from "../../models/business/employeesAssocitedBusiness.js";
import { Business } from "../../models/common/business.js";

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
            // console.log(newProfile)

            // Commit de la transacción
            await t.commit();

            // Generar token de autenticación
            const token = signJWT({
                userId: newUserBusiness.id,
                roles: [ ownerRole.role ],
                business: {
                    id: null,
                    typeCompany: null,
                    name: null
                },
            });

            const expiresIn = 3600;

            return {
                error: false,
                message: 'Registrado exitosamente',
                data: {
                    user: {
                        id: newUserBusiness.id,
                        name: newUserBusiness.name,
                        roles: [ ownerRole.role ],
                    },
                    business: {
                        id: null,
                        typeCompany: null,
                        name: null
                    },
                    token,
                    expiresIn,
                },
            };

        } catch (error) {
            // Si hay un error, hacemos rollback de la transacción
            await t.rollback()
            console.error('Error al registrar usuario:', error);
            return { error: true, message: `Error al registrar usuario: ${error}` };
        }
    }

    /**
     * Login a user
     * @param {string} credential - The user's credential (e.g., email or username)
     * @param {string} password - The user's password
     * @returns {Promise<object>} - Authentication result
     */
    static async login({ userCode, password }) {

        try {
            // Verificar si el usuario existe
            const user = await UserBusiness.findOne({ where: { credential: userCode } });
            if (!user) {
                return {
                    error: true,
                    statusCode: 401,
                    message: "Invalid credentials",
                };
            }

            // Verificar la contraseña
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return {
                    error: true,
                    statusCode: 401,
                    message: "Invalid credentials",
                };
            }

            // Obtener rol del usuario
            const roles = await UserBusinessRole.findOne({
                where: { id: user.userBusinessRoleId },
            });

            const roleNames = [roles.role]
            console.log(roles.role)

            let business;
            if (roles.role == rolesEnum.OWNER) {
                business = await Business.findOne({
                    where: { ownerId: user.id },
                    attributes: ['id', 'typeCompany', 'name'],
                });
            } else {
                const employeeAssocitedBusiness = await EmployeesAssociatedBusinesses.findOne({
                    where: { usersBusinessId: user.id },
                    include: [
                        {
                            model: Business,
                            // required: true,
                            attributes: ['id', 'typeCompany', 'name'],
                        },
                    ]
                });
                if (!employeeAssocitedBusiness) {
                    return {
                        error: true,
                        statusCode: 500,
                        message: "Server Error",
                    };
                }

                business = employeeAssocitedBusiness.business;
            }

            // Generar token de autenticación
            const token = signJWT({
                userId: user.id,
                roles: roleNames,
                business: {
                    id: business.id,
                    typeCompany: business.typeCompany,
                    name: business.name,
                },
            });

            const expiresIn = 3600;

            // Respuesta exitosa
            return {
                error: false,
                statusCode: 200,
                message: "Authentication successful",
                data: {
                    user: {
                        id: user.id,
                        name: user.name,
                        roles: roleNames,
                    },
                    business: {
                        id: business.id,
                        typeCompany: business.typeCompany,
                        name: business.name,
                    },
                    token,
                    expiresIn,
                },
            };

        } catch (error) {
            console.error("Error during login:", error);
            return {
                error: true,
                statusCode: 500,
                message: "An error occurred during authentication",
            };
        }
    }

}
