import bcrypt from "bcrypt";
import { Op } from "sequelize";
import { generateUniqueCode, sendResponse, validateEmailFormat, validateRequiredFields } from "../../helpers/utils.js";

import { UserBusinessRole } from "../../models/business/userBusinessRoles.js";
import { UserBusiness } from "../../models/business/usersBusiness.js";
import { ProfileBusiness } from "../../models/business/profileBusiness.js";
import { Branch } from "../../models/common/branch.js";
import { EmployeesAssociatedBusinesses } from "../../models/business/employeesAssocitedBusiness.js";
import { BusinessFunction } from "../../models/business/businessFunction.js";
import { AssignedUserFunction } from "../../models/assignedUserFunction.js";
import { rolesEnum } from "../../enum/roles.enum.js";
import { Invoice } from "../../models/common/invoice.js";
import { invoiceStatusEnum } from "../../enum/invoiceStatus.enum.js";


export class EmployeeManagementController {



    /**
    * Crea las credenciales del empleado cobrador
    */
    // POST business/employees/collector/create/:businessId
    static async createCollectorEmployeeCredentials(req, res) {
        const { businessId } = req.params;
        const { name, lastname, rut, email, role, branchId, keyword, password } = req.body;

        try {
            // Verificar si la sucursal existe
            const branch = await Branch.findOne({ where: { id: branchId, businessId } });
            if (!branch) {
                return sendResponse(res, 404, true, 'Sucursal no encontrado');
            }

            // Verificar si el nombre de usuario ya existe
            const existingUser = await UserBusiness.findOne({
                where: {
                    [Op.or]: [
                        { email },
                        { credential: `${rut}.${keyword}` }
                    ]
                }
            });
            if (existingUser) {
                return sendResponse(res, 400, true, "El correo electrónico o la credencial ya están en uso");
            }

            // Buscar el rol "manager" en la tabla de roles
            const collectorRole = await UserBusinessRole.findOne({ where: { role: rolesEnum.COLLECTOR } });

            // Crear un nuevo usuario
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUserBusiness = await UserBusiness.create({
                email,
                password: hashedPassword,
                keyword: keyword,
                credential: `${rut}.${keyword}`,
                userBusinessRoleId: collectorRole.id,
            });

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
            });

            // Asociar al empleado a la empresa
            const EmployeesAssociated = EmployeesAssociatedBusinesses.create({ usersBusinessId: newUserBusiness.id, businessId })

            return sendResponse(res, 201, false, "La credencial ha sido creada exitosamente.", newUserBusiness);
        } catch (error) {
            console.error("Error al crear la credential:", error);
            return sendResponse(res, 500, true, "Error al crear la credential");
        }
    }



    /**
     * Obtiene el detalle de un empleado
     */
    // GET business/employees/getDetails/:businessId/employeeID/:userId
    static async getEmployeesDetails(req, res) {
        try {
            const { userId } = req.params;

            // Buscar el empleado
            const employee = await UserBusiness.findByPk(userId, {
                attributes: ['id', 'email', 'status', 'keyword'],
                include: [
                    {
                        model: ProfileBusiness,
                    },
                ]
            });

            if (!employee) {
                return sendResponse(res, 404, true, "Empleado no encontrada");
            }

            // Convertir la cadena JSON de productos en un objeto
            employee.profiles_business.additionalData = await JSON.parse(employee.profiles_business.additionalData);
            if (employee.profiles_business.additionalData?.branch?.operatingHours) {
                employee.profiles_business.additionalData.branch.operatingHours = JSON.parse(employee.profiles_business.additionalData.branch.operatingHours);
            }

            // Obtener estadísticas de las facturas
            const invoices = await Invoice.findAll({
                where: {
                    collectorId: employee.id,
                    status: invoiceStatusEnum.PAID
                }
            });

            let totalEarnings = invoices.reduce((total, invoice) => total + (invoice.totalGeneral || 0), 0); // Asumimos que 'totalAmount' es el campo que contiene el monto de la factura
            totalEarnings = parseFloat(totalEarnings.toFixed(2));
            const totalInvoices = invoices.length; // Número de facturas completadas

            // Estructura de la respuesta
            const response = {
                id: employee.id,  // ID del empleado
                name: employee.profiles_business.name,
                lastName: employee.profiles_business.lastname,
                profileImage: employee.profiles_business.profilePicture || "",
                email: employee.email,
                createdAt: employee.createdAt,
                // role: "cobrador",  // Role fijo según tu estructura (puedes modificarlo si es necesario)
                credentialType: "employee",  // Tipo de credencial
                keyword: employee.keyword,
                status: employee.status,  // Estado del empleado
                statistics: [
                    {
                        title: "Total de Ganancias",
                        value: totalEarnings  // Puedes calcular este valor según tu lógica de negocio
                    },
                    {
                        title: "Total de Facturas",
                        value: totalInvoices  // Igualmente, este valor se puede calcular
                    }
                ]
            };

            return sendResponse(res, 200, false, "Empleado recuperado exitosamente", response);
        } catch (error) {
            console.error('Error al conseguir empleado por empresa:', error);
            return sendResponse(res, 500, true, "No se pudo recuperar los empleado");
        }
    }



    /** ********************************
     * OWNER
     ******************************** */

    /**
     * Obtiene los empleados asociados a una empresa
     */
    // GET business/employees/all/:businessId?page=1&role=manager&search=name
    static async getEmployeesByBusiness(req, res) {
        const { businessId } = req.params;
        let { page, role, search } = req.query;

        try {
            // Configurar opciones de paginación
            page = parseInt(page, 10) || 1;  // Si `page` no es válido, asignar 1 como valor predeterminado
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
                        required: true,
                        attributes: ['id', 'email', 'status', 'createdAt'],
                        include: [
                            {
                                model: ProfileBusiness,
                                required: true,
                                attributes: ['id', 'name', 'lastname', 'profilePicture'],
                            },
                            {
                                model: UserBusinessRole,
                                required: true,
                                attributes: ['id', 'role'],
                            },
                        ]
                    },
                ]
            });

            return sendResponse(res, 200, false, "Empleados recuperados exitosamente",
                {
                    employees: employees.rows,
                    pagination: {
                        currentPage: Number(page),
                        totalPages: Math.ceil(employees.count / pageSize),
                    },
                }
            );
        } catch (error) {
            console.error('Error al localizar empleados por empresa:', error);
            return sendResponse(res, 500, true, "No se pudo recuperar los empleados");
        }
    }




















    /**
     * Crea las credenciales del empleado gerente
     */
    // POST business/employees/manager/create/:businessId
    static async createManagerEmployeeCredentials(req, res) {
        const { businessId } = req.params;
        const { name, lastname, rut, email, password, keyword, phone, branchId, functions } = req.body;

        try {
            // Validar la presencia de los campos requeridos
            const requiredFields = [
                "email",
                "password",
                "keyword",
                "name",
                "lastname",
                "rut",
                "phone",
                "branchId",
                "functions"
            ];
            const missingFields = validateRequiredFields(req.body, requiredFields);
            if (missingFields.length > 0) {
                return sendResponse(res, 400, true, `Los campos son obligatorios: ${missingFields.join(", ")}`);
            }

            // Validar si el email tiene un formato válido
            if (!validateEmailFormat(email)) {
                return sendResponse(res, 400, true, "El correo electrónico no tiene un formato válido.");
            }

            // Verificar si la sucursal existe
            const branch = await Branch.findOne({ where: { id: branchId, businessId } });
            if (!branch) {
                return sendResponse(res, 404, true, 'Sucursal no encontrado');
            }

            // Verificar si todas las funciones en el array existen
            const existingFunctions = await BusinessFunction.findAll({
                where: {
                    id: functions
                }
            });
            const existingFunctionIds = existingFunctions.map(func => func.id);
            const nonExistingFunctionIds = functions.filter(id => !existingFunctionIds.includes(id));
            // if (nonExistingFunctionIds.length > 0) {
            //     // Devolver los IDs de las funciones que no existen
            //     return sendResponse(res, 404, false, "Las siguientes funciones no existen:", null, {missingFunctionIds: nonExistingFunctionIds});
            // }

            // Verificar si el nombre de usuario ya existe
            const existingUser = await UserBusiness.findOne({
                where: {
                    [Op.or]: [
                        { email },
                        { credential: `${rut}.${keyword}` }
                    ]
                }
            });
            if (existingUser) {
                return sendResponse(res, 400, true, "El correo electrónico o la credencial ya están en uso");
            }

            // Buscar el rol "manager" en la tabla de roles
            const managerRole = await UserBusinessRole.findOne({ where: { role: rolesEnum.MANAGER } });

            // Crear un nuevo usuario
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUserBusiness = await UserBusiness.create({
                email,
                password: hashedPassword,
                keyword: keyword,
                credential: `${rut}.${keyword}`,
                userBusinessRoleId: managerRole.id,
            });

            // Registrar perfil del usuario
            const newProfile = await ProfileBusiness.create({
                codeEmployee: generateUniqueCode(),
                name,
                lastname,
                rut,
                phone,
                additionalData: {
                    branch,
                },
                usersBusinessId: newUserBusiness.id,
            });

            // Asociar al empleado a la empresa
            const employeesAssociated = await EmployeesAssociatedBusinesses.create({ usersBusinessId: newUserBusiness.id, businessId })

            // Asignar funciones al usuario
            existingFunctionIds.map(async (businessFunctionId) => {
                await AssignedUserFunction.create({ usersBusinessId: newUserBusiness.id, businessFunctionId })
            })


            return sendResponse(res, 201, false, "La credencial ha sido creada exitosamente", newUserBusiness);
        } catch (error) {
            console.error("Error al crear la credential:", error);
            return sendResponse(res, 500, true, "Error al crear la credential");
        }
    }




}