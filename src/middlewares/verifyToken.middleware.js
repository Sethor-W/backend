import { verifyJWT } from "../helpers/jwt.helper.js";
import { sendResponse } from "../helpers/utils.js";

export function verifyTokenMiddleware(req, res, next) {

    const authorizationHeader = req.headers.authorization;
    console.log(req.headers)

    // Verificar si el token existe
    if (!authorizationHeader) {
        return sendResponse(res, 401, true, 'Token de autenticación no proporcionado');
    }
    const [tokenType, token] = authorizationHeader.split(' ');


    // Verificar y decodificar el token utilizando el helper
    const decodedToken = verifyJWT(token);
    if (!decodedToken) {
        return sendResponse(res, 401, true, 'Autenticación no válida');
    } else {
        req.user = decodedToken;
        next();
    }
}
