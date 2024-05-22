

import { AssignedUserFunction } from "../models/assignedUserFunction.js";


export function CheckPermissionBusinessMiddleware(functionId) {
    return async (req, res, next) => {
        const userId = req.user.id; // Suponiendo que tienes el ID del usuario en req.user

        try {
            // Verificar si el usuario tiene la función asignada
            const assignedFunctions = await AssignedUserFunction.findAll({
                where: { usersBusinessId: userId },
                include: [BusinessFunction]
            });

            const hasPermission = assignedFunctions.some(assignedFunction => {
                return assignedFunction.BusinessFunction.id === functionId;
            });

            if (hasPermission) {
                // El usuario tiene permiso para acceder a esta ruta
                next();
            } else {
                // El usuario no tiene permiso para acceder a esta ruta
                return sendResponse(res, 403, true, `Acceso denegado`);
            }
        } catch (error) {
            console.error('Error al verificar permisos:', error);
            return sendResponse(res, 500, true, 'Internal Server Error');
        }
    };
};
