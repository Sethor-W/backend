import bcrypt from 'bcrypt';
import { discountTypeEnum } from "../../enum/discountType.enum.js";
import { Invoice } from "../../models/common/invoice.js";
import { Business } from "../../models/common/business.js";
import { UserBusiness } from "../../models/business/usersBusiness.js";
import { User } from "../../models/client/users.js";
import { Profile } from "../../models/client/profile.js";
import { ProfileBusiness } from "../../models/business/profileBusiness.js";
import { Op } from "sequelize";
import { Branch } from "../../models/common/branch.js";
import { Product } from "../../models/client/product.js";
import { CategoryProduct } from "../../models/common/categoryProduct.js";
import { UserBusinessRole } from "../../models/business/userBusinessRoles.js";
import { rolesEnum } from "../../enum/roles.enum.js";
import { EmployeesAssociatedBusinesses } from "../../models/business/employeesAssocitedBusiness.js";
import { generateUniqueCode } from '../../helpers/utils.js';
import { sequelize } from '../../config/database.config.js';
import { invoiceStatusEnum } from '../../enum/invoiceStatus.enum.js';
import { actuveAccountEnum } from '../../enum/activeAccount.enum.js';

export class EmployeeManagementBusinessService {


    static async createEmployeeCredentials(locales, body) {
        const { businessId } = locales;
        const { name, lastname, rut, email, role, branchId, keyword, password, phone, profilePicture } = body;

        try {
            // Iniciar una transacción
            const transaction = await sequelize.transaction();

            // Verificar si la sucursal existe
            const branch = await Branch.findOne({
                where: {
                    id: branchId,
                    businessId
                },
                transaction
            });
            if (!branch) {
                return {
                    error: true,
                    statusCode: 404,
                    message: "Sucursal no encontrada",
                };
            }

            // Verificar si el nombre de usuario ya existe
            const existingUser = await UserBusiness.findOne({
                where: {
                    [Op.or]: [
                        { email },
                        { credential: `${rut}.${keyword}` }
                    ]
                },
                transaction
            });
            if (existingUser) {
                return {
                    error: true,
                    statusCode: 400,
                    message: "El correo electrónico o la credencial ya están en uso",
                };
            }

            // Validar que el rol sea collector o manager
            if (role !== rolesEnum.COLLECTOR && role !== rolesEnum.MANAGER) {
                return {
                    error: true,
                    statusCode: 400,
                    message: "El rol debe ser collector o manager",
                };
            }

            // Buscar el rol en la tabla de roles
            const userRole = await UserBusinessRole.findOne({
                where: { role },
                transaction
            });

            // Crear un nuevo usuario
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUserBusiness = await UserBusiness.create({
                email,
                password: hashedPassword,
                keyword,
                credential: `${rut}.${keyword}`,
                userBusinessRoleId: userRole.id,
            }, { transaction });

            // Registrar perfil del usuario
            const newProfile = await ProfileBusiness.create({
                name,
                lastname,
                rut,
                phone,
                profilePicture,
                usersBusinessId: newUserBusiness.id,
            }, { transaction });

            // Asociar al empleado a la empresa
            await EmployeesAssociatedBusinesses.create({
                usersBusinessId: newUserBusiness.id,
                businessId,
                branchId,
            }, { transaction });

            // Confirmar la transacción
            await transaction.commit();

            return {
                error: false,
                statusCode: 201,
                message: "La credencial ha sido creada exitosamente.",
                data: {
                    id: newUserBusiness.id,
                    status: newUserBusiness.status,
                    email: newUserBusiness.email,
                    keyword: newUserBusiness.keyword,
                    profile: newProfile,
                },
            }

        } catch (error) {
            // Revertir los cambios en caso de error
            if (transaction) await transaction.rollback();
            console.error("Error al crear la credential:", error);
            return {
                error: true,
                statusCode: 500,
                message: "Error al crear la credential",
            };
        }
    }


    static async getEmployeeCollectorDetails(locales, params) {
        const { businessId } = locales;
        const { employeeId } = params;

        try {
            // Buscar el empleado
            const employeeAssociatedToBusinesses = await EmployeesAssociatedBusinesses.findAndCountAll({
                where: {
                    usersBusinessId: employeeId,
                    businessId,
                }
            });

            if (employeeAssociatedToBusinesses.count === 0) {
                return {
                    error: true,
                    statusCode: 404,
                    message: "Empleado no encontrado",
                }
            }

            // Buscar el empleado
            const employee = await UserBusiness.findByPk(employeeId, {
                attributes: ['id', 'email', 'status', 'keyword'],
                include: [
                    {
                        model: ProfileBusiness,
                    },
                ]
            });

            if (!employee) {
                return {
                    error: true,
                    statusCode: 404,
                    message: "Empleado no encontrado",
                }
            }

            // Obtener estadísticas de las facturas
            const invoices = await Invoice.findAll({
                where: {
                    collectorId: employee.id,
                    status: invoiceStatusEnum.PAID
                }
            });

            // Estadisticas del empleado
            let totalEarnings = invoices.reduce((total, invoice) => total + (invoice.totalGeneral || 0), 0);
            totalEarnings = parseFloat(totalEarnings.toFixed(2));
            const totalInvoices = invoices.length;


            return {
                error: false,
                statusCode: 200,
                message: "Empleado recuperado exitosamente",
                data: {
                    id: employee.id,
                    name: employee.profiles_business.name,
                    lastName: employee.profiles_business.lastname,
                    profileImage: employee.profiles_business.profilePicture || "",
                    email: employee.email,
                    createdAt: employee.createdAt,
                    role: "cobrador",
                    credentialType: "employee",
                    keyword: employee.keyword,
                    status: employee.status,
                    statistics: [
                        {
                            title: "Total de Ganancias",
                            value: totalEarnings
                        },
                        {
                            title: "Total de Facturas",
                            value: totalInvoices
                        }
                    ]
                }
            };

        } catch (error) {
            console.error("Error al conseguir empleado por empresa:", error);
            return {
                error: true,
                statusCode: 500,
                message: "Error al conseguir empleado por empresa",
            };
        }
    }


    static async getEmployeesByBusiness(locales, query) {
        const { businessId } = locales;
        let { role, search } = query;

        try {
            // Configuración de criterios de consulta
            const whereCondition = { businessId };
            if (role) whereCondition.role = role;
            if (search) {
                whereCondition[Op.or] = [
                    { '$users_business.profiles_business.name$': { [Op.like]: `%${search}%` } },
                    { '$users_business.profiles_business.lastName$': { [Op.like]: `%${search}%` } },
                ];
            }

            // Buscar los empleados asociados a la empresa con filtros
            const employees = await EmployeesAssociatedBusinesses.findAll({
                where: whereCondition,
                order: [['createdAt', 'DESC']],
                attributes: ['id', 'usersBusinessId', 'businessId', 'branchId'],
                include: [
                    {
                        model: UserBusiness,
                        attributes: ['id', 'email', 'status', 'createdAt'],
                        include: [
                            {
                                model: ProfileBusiness,
                            },
                            {
                                model: UserBusinessRole,
                                attributes: ['id', 'role'],
                            },
                        ]
                    },
                ]
            });

            return {
                error: false,
                statusCode: 200,
                message: "Empleados recuperados exitosamente",
                data: {
                    employees: employees
                }
            };
        } catch (error) {
            console.error("No se pudo recuperar los empleados:", error);
            return {
                error: true,
                statusCode: 500,
                message: "No se pudo recuperar los empleados",
            };
        }
    }

    static async updateEmployeeStatus(locales, params, body) {
        const { businessId } = locales;
        const { employeeId } = params;
        const { status } = body;

        try {
            // Verificar que el estatus sea válido
            if (status !== actuveAccountEnum.ACTIVE && status !== actuveAccountEnum.DESACTIVED) {
                return {
                    error: true,
                    statusCode: 400,
                    message: `El estado debe ser ${actuveAccountEnum.ACTIVE} o ${actuveAccountEnum.DESACTIVED}`,
                };
            }

            // Verificar si el empleado existe y pertenece a la empresa
            const employeeAssociated = await EmployeesAssociatedBusinesses.findOne({
                where: {
                    usersBusinessId: employeeId,
                    businessId
                }
            });

            if (!employeeAssociated) {
                return {
                    error: true,
                    statusCode: 404,
                    message: "Empleado no encontrado o no está asociado a esta empresa",
                };
            }

            // Actualizar el estado del empleado
            const employee = await UserBusiness.findByPk(employeeId);
            
            if (!employee) {
                return {
                    error: true,
                    statusCode: 404,
                    message: "Empleado no encontrado",
                };
            }

            // Actualizar el estado
            await employee.update({ status });

            return {
                error: false,
                statusCode: 200,
                message: status === actuveAccountEnum.ACTIVE ? "Credencial de empleado activada exitosamente" : "Credencial de empleado desactivada exitosamente",
                data: {
                    id: employee.id,
                    status: employee.status,
                }
            };

        } catch (error) {
            console.error("Error al actualizar el estado del empleado:", error);
            return {
                error: true,
                statusCode: 500,
                message: "Error al actualizar el estado del empleado",
            };
        }
    }

    static async updateEmployeePassword(locales, params, body) {
        const { businessId } = locales;
        const { employeeId } = params;
        const { newPassword } = body;

        try {
            // Verificar si el empleado existe y pertenece a la empresa
            const employeeAssociated = await EmployeesAssociatedBusinesses.findOne({
                where: {
                    usersBusinessId: employeeId,
                    businessId
                }
            });

            if (!employeeAssociated) {
                return {
                    error: true,
                    statusCode: 404,
                    message: "Empleado no encontrado o no está asociado a esta empresa",
                };
            }

            // Obtener el empleado
            const employee = await UserBusiness.findByPk(employeeId);
            
            if (!employee) {
                return {
                    error: true,
                    statusCode: 404,
                    message: "Empleado no encontrado",
                };
            }

            // Actualizar la contraseña
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await employee.update({ password: hashedPassword });

            return {
                error: false,
                statusCode: 200,
                message: "Contraseña actualizada exitosamente",
            };

        } catch (error) {
            console.error("Error al actualizar la contraseña del empleado:", error);
            return {
                error: true,
                statusCode: 500,
                message: "Error al actualizar la contraseña del empleado",
            };
        }
    }

    static async updateEmployeeInformation(locales, params, body) {
        const { businessId } = locales;
        const { employeeId } = params;
        const { name, lastname, phone, branchId, profilePicture, role } = body;

        let transaction;

        try {
            // Start transaction
            transaction = await sequelize.transaction();

            // Verify employee exists and belongs to business
            const employeeAssociated = await EmployeesAssociatedBusinesses.findOne({
                where: {
                    usersBusinessId: employeeId,
                    businessId
                },
                transaction
            });

            if (!employeeAssociated) {
                await transaction.rollback();
                return {
                    error: true,
                    statusCode: 404,
                    message: "Empleado no encontrado o no está asociado a esta empresa",
                };
            }

            // Get employee and profile
            const [employee, profile] = await Promise.all([
                UserBusiness.findByPk(employeeId, { transaction }),
                ProfileBusiness.findOne({
                    where: { usersBusinessId: employeeId },
                    transaction
                })
            ]);
            
            if (!employee || !profile) {
                await transaction.rollback();
                return {
                    error: true,
                    statusCode: 404,
                    message: "Empleado o perfil no encontrado",
                };
            }

            // Update role if provided
            if (role) {
                const roleRecord = await UserBusinessRole.findOne({
                    where: { role: role },
                    transaction
                });

                if (!roleRecord) {
                    await transaction.rollback();
                    return {
                        error: true,
                        statusCode: 404,
                        message: "Rol no encontrado",
                    };
                }

                await employee.update({ userBusinessRoleId: roleRecord.id }, { transaction });
            }

            // Update profile information
            const profileUpdates = {
                ...(name && { name }),
                ...(lastname && { lastname }),
                ...(phone && { phone }),
                ...(profilePicture && { profilePicture })
            };

            if (Object.keys(profileUpdates).length > 0) {
                await profile.update(profileUpdates, { transaction });
            }

            // Update branch if provided
            if (branchId) {
                const branch = await Branch.findOne({
                    where: {
                        id: branchId,
                        businessId
                    },
                    transaction
                });

                if (!branch) {
                    await transaction.rollback();
                    return {
                        error: true,
                        statusCode: 404,
                        message: "Sucursal no encontrada",
                    };
                }

                console.log(branchId);
                const a = await employeeAssociated.update({ branchId: branchId }, { transaction });
                console.log(a);
            }

            // Commit transaction
            await transaction.commit();

            return {
                error: false,
                statusCode: 200,
                message: "Información del empleado actualizada exitosamente",
                data: {
                    id: employee.id,
                    email: employee.email,
                    role: employee.userBusinessRoleId,
                    profile: {
                        name: profile.name,
                        lastname: profile.lastname,
                        phone: profile.phone,
                        profilePicture: profile.profilePicture
                    },
                    branchId: employeeAssociated.branchId
                }
            };

        } catch (error) {
            if (transaction) await transaction.rollback();
            console.error("Error al actualizar la información del empleado:", error);
            return {
                error: true,
                statusCode: 500,
                message: "Error al actualizar la información del empleado",
            };
        }
    }
}
