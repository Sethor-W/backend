import { sendResponse } from "../helpers/utils.js";


export function checkRoleMiddleware(roles) {
    return (req, res, next) => {
        const { user } = req;

        // Verificar si el usuario tiene alguno de los roles necesarios
        if (!roles.includes(user.role)) {
            return sendResponse(res, 403, true, `Only ${roles.join(' or ')} can perform this action`, user);
        }

        // Si el usuario tiene uno de los roles correctos, continúa con la solicitud
        next();
    };
};