import bcrypt from "bcrypt";
import { Op } from "sequelize";
import { sendResponse, validateEmailFormat, validateRequiredFields } from "../helpers/utils.js";

import { UserBusinessRole } from "../models/userBusinessRoles.js";
import { UserBusiness } from "../models/usersBusiness.js";
import { ProfileBusiness } from "../models/profileBusiness.js";
import { Branch } from "../models/branch.js";
import { EmployeesAssociatedBusinesses } from "../models/employeesAssocitedBusiness.js";
import { BusinessFunction } from "../models/businessFunction.js";
import { AssignedUserFunction } from "../models/assignedUserFunction.js";
import { rolesEnum } from "../enum/roles.enum.js";


export class EmployeeManagementController {


    /**
     * Crea las credenciales del empleado gerente
     */
    // POST business/employees/manager/create/:businessId
    static async createManagerEmployeeCredentials(req, res) {
        const { businessId } = req.params;
        const { email, password, keyword, name, lastname, rut, phone, branchId, functions } = req.body;

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
                return sendResponse(res, 400, true, `The fields are required: ${missingFields.join(", ")}`);
            }

            // Validar si el email tiene un formato válido
            if (!validateEmailFormat(email)) {
                return sendResponse(res, 400, true, "The email does not have a valid format");
            }

            // Verificar si la sucursal existe
            const branch = await Branch.findOne({ where: { id: branchId, businessId } });
            if (!branch) {
                return sendResponse(res, 404, true, 'Branch not found');
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
                return sendResponse(res, 400, true, "Email or credential is already in use");
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
                codeEmployee: '0022',
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
            existingFunctionIds.map(async (businessFunctionId)=> {
                await AssignedUserFunction.create({ usersBusinessId: newUserBusiness.id, businessFunctionId })
            })


            return sendResponse(res, 201, false, "The credential has been created successfully", newUserBusiness);
        } catch (error) {
            console.error("Error al crear la credential:", error);
            return sendResponse(res, 500, true, "Error al crear la credential");
        }
    }

    /**
     * Crea las credenciales del empleado cobrador
     */
    // POST business/employees/collector/create/:businessId
    static async createCollectorEmployeeCredentials(req, res) {
        const { businessId } = req.params;
        const { email, password, keyword, name, lastname, rut, phone, branchId, startTime, departureTime } = req.body;

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
                "startTime",
                "departureTime",
            ];
            const missingFields = validateRequiredFields(req.body, requiredFields);
            if (missingFields.length > 0) {
                return sendResponse(res, 400, true, `The fields are required: ${missingFields.join(", ")}`);
            }

            // Validar si el email tiene un formato válido
            if (!validateEmailFormat(email)) {
                return sendResponse(res, 400, true, "The email does not have a valid format");
            }

            // Verificar si la sucursal existe
            const branch = await Branch.findOne({ where: { id: branchId, businessId } });
            if (!branch) {
                return sendResponse(res, 404, true, 'Branch not found');
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
                return sendResponse(res, 400, true, "Email or credential is already in use");
            }

            // Buscar el rol "manager" en la tabla de roles
            const collectorRole = await UserBusinessRole.findOne({ where: { role: rolesEnum.COLLECTOR} });

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
                codeEmployee: '0022',
                name,
                lastname,
                rut,
                phone,
                additionalData: {
                    branch,
                    employeeSchedule: {
                        startTime,
                        departureTime
                    }
                },
                usersBusinessId: newUserBusiness.id,
            });

            // Asociar al empleado a la empresa
            const EmployeesAssociated = EmployeesAssociatedBusinesses.create({ usersBusinessId: newUserBusiness.id, businessId })

            return sendResponse(res, 201, false, "The credential has been created successfully", newUserBusiness);
        } catch (error) {
            console.error("Error al crear la credential:", error);
            return sendResponse(res, 500, true, "Error al crear la credential");
        }
    }

    /** ****************************
     * MANAGER
     **************************** */

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
                return sendResponse(res, 404, true, "Employee not found");
            }
            
            // Convertir la cadena JSON de productos en un objeto
            employee.profiles_business.additionalData = await JSON.parse(employee.profiles_business.additionalData);
            if (employee.profiles_business.additionalData?.branch?.operatingHours) {
                employee.profiles_business.additionalData.branch.operatingHours = JSON.parse(employee.profiles_business.additionalData.branch.operatingHours);
            }

            return sendResponse(res, 200, false, "Employees retrieved successfull", employee);
        } catch (error) {
            console.error('Error getting employees by business:', error);
            return sendResponse(res, 500, true, "Could not retrieve employees");
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
        const { page, role, search } = req.query;

        try {
            if (!page) {
                return sendResponse(res, 400, true, 'The page parameter is required');
            }

            // Configurar opciones de paginación
            const pageSize = 15;
            const offset = (page - 1) * pageSize;

            // Configurar la condición de consulta para los filtros
            const whereCondition = {
                businessId,
                ...(role && { role }), // Filtrar por rol si se proporciona
                ...(search && { name: { [Op.like]: `%${search}%` } }) // Filtrar por nombre si se proporciona
            };

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
                        attributes: ['id', 'email', 'status'],
                        include: [
                            {
                                model: ProfileBusiness,
                                required: true,
                                attributes: ['id', 'name', 'lastname'],
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

            return sendResponse(res, 200, false, "Employees retrieved successfull", employees);
        } catch (error) {
            console.error('Error getting employees by business:', error);
            return sendResponse(res, 500, true, "Could not retrieve employees");
        }
    }


}