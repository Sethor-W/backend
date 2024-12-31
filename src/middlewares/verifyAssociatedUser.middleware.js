import { rolesEnum } from "../enum/roles.enum.js";
import { sendResponse } from "../helpers/utils.js";
import { Business } from "../models/common/business.js";
import { EmployeesAssociatedBusinesses } from "../models/business/employeesAssocitedBusiness.js";

export const verifyAssociatedUserMiddleware = async (req, res, next) => {
    const { userId, role } = req.user;
    const { businessId } = req.params;

    try {
        if (!businessId) {
            return sendResponse(res, 400, true, '"businessId" se requiere.');
        }

        // Si el usuario tiene el rol de "owner", verificar el campo ownerId en la tabla Business
        if (role === rolesEnum.OWNER) {
            const business = await Business.findByPk(businessId);
            if (!business || business.ownerId !== userId) {
                return sendResponse(res, 403, true, 'No autorizado. No estás asociado con este negocio.');
            }
        } else {
            // Si el usuario tiene otro rol, verificar en la tabla employees_associated_businesses
            const association = await EmployeesAssociatedBusinesses.findOne({
                where: {
                    usersBusinessId: userId,
                    businessId: businessId
                }
            });

            if (!association) {
                return sendResponse(res, 403, true, 'No autorizado. No estás asociado con este negocio.');
            }
        }

        // Si se encuentra una asociación o es owner, permitir que continúe la solicitud
        next();
    } catch (error) {
        console.error('Error al verificar el usuario asociado:', error);
        return sendResponse(res, 500, true, 'Internal Server Error');
    }
};
