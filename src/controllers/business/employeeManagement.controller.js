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
import { EmployeeManagementBusinessService } from "../../services/business/employeeManagement.service.js";


export class EmployeeManagementController {


    /**
    * Crea las credenciales del empleado cobrador
    */
    // POST business/:businessId/employees/collector
    static async createCollectorEmployeeCredentials(req, res) {
        const result = await EmployeeManagementBusinessService.createCollectorEmployeeCredentials(req.locales, req.body)
        return sendResponse(res, result.statusCode, result.error, result.message, result.data);
    }



    /**
     * Obtiene el detalle de un empleado
     */
    // GET business/:businessId/employees/:employeeId
    static async getEmployeeCollectorDetails(req, res) {
        const result = await EmployeeManagementBusinessService.getEmployeeCollectorDetails(req.locales, req.params)
        return sendResponse(res, result.statusCode, result.error, result.message, result.data);
    }



    /** ********************************
     * OWNER
     ******************************** */

    /**
     * Obtiene los empleados asociados a una empresa
     */
    // GET business/:businessId/employees?page=1
    static async getEmployeesByBusiness(req, res) {
        const result = await EmployeeManagementBusinessService.getEmployeesByBusiness(req.locales, req.query)
        return sendResponse(res, result.statusCode, result.error, result.message, result.data);
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