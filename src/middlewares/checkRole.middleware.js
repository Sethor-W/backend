import { sendResponse } from "../helpers/utils.js";


export function checkRoleMiddleware(roles) {
    return (req, res, next) => {
        const { user } = req;

        // Verificar si el usuario tiene alguno de los roles necesarios
        const hasRole = user.roles.some(role => roles.includes(role));
        if (!hasRole) {
            return sendResponse(res, 403, true, `Sólo ${roles.join(' o ')} puede realizar esta acción`, user);
        }

        // Si el usuario tiene uno de los roles correctos, continúa con la solicitud
        next();
    };
};