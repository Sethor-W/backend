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

export class EmployeeManagementBusinessService {


    // Crear una nueva categoría de producto
    static async createCollectorEmployeeCredentials(locales, body) {
        const { businessId } = locales;
        const { name, lastname, rut, email, role, branchId, keyword, password } = body;

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

            // Buscar el rol "manager" en la tabla de roles
            const collectorRole = await UserBusinessRole.findOne({
                where: { role: rolesEnum.COLLECTOR },
                transaction
            });

            // Crear un nuevo usuario
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUserBusiness = await UserBusiness.create({
                email,
                password: hashedPassword,
                keyword: keyword,
                credential: `${rut}.${keyword}`,
                userBusinessRoleId: collectorRole.id,
            }, { transaction });

            // Registrar perfil del usuario
            const newProfile = await ProfileBusiness.create({
                codeEmployee: generateUniqueCode(),
                name,
                lastname,
                rut,
                phone: '123',
                additionalData: {
                    branch,
                },
                usersBusinessId: newUserBusiness.id,
            }, { transaction });

            // Asociar al empleado a la empresa
            const EmployeesAssociated = await EmployeesAssociatedBusinesses.create({
                usersBusinessId: newUserBusiness.id,
                businessId
            }, { transaction })

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
        let { page, role, search } = query;

        try {
            // Configurar opciones de paginación
            page = parseInt(page, 10) || 1;
            const pageSize = 15;
            const offset = (page - 1) * pageSize;

            // Configuración de criterios de consulta
            const whereCondition = { businessId };
            if (role) whereCondition.role = role;
            if (search) {
                whereCondition[Op.or] = [
                    { '$users_business.profiles_business.name$': { [Op.like]: `%${search}%` } },
                    { '$users_business.profiles_business.lastName$': { [Op.like]: `%${search}%` } },
                ];
            }

            // Buscar los empleados asociados a la empresa con paginación y filtros
            const employees = await EmployeesAssociatedBusinesses.findAndCountAll({
                where: whereCondition,
                order: [['createdAt', 'DESC']],
                limit: pageSize,
                offset: offset,
                attributes: ['id', 'usersBusinessId', 'businessId'],
                include: [
                    {
                        model: UserBusiness,
                        // required: true,
                        attributes: ['id', 'email', 'status', 'createdAt'],
                        include: [
                            {
                                model: ProfileBusiness,
                                // required: true,
                                // attributes: ['id', 'name', 'lastname', 'profilePicture'],
                            },
                            {
                                model: UserBusinessRole,
                                // required: true,
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
                    employees: employees.rows,
                    pagination: {
                        currentPage: Number(page),
                        totalPages: Math.ceil(employees.count / pageSize),
                    },
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



}
