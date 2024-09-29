import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';



/**
 * Función para validar los campos requeridos
 * @param {req.body} body - El body del endpoint 
 * @param {array} requiredFields - Array de los campos requeridos
 * @returns 
 */
export function validateRequiredFields(body, requiredFields) {
    const missingFields = [];
    requiredFields.forEach(field => {
        if (!body[field]) {
            missingFields.push(field);
        }
    });
    return missingFields;
}

/**
 * Función para validar el formato del correo electrónico
 * @param {string} email
 * @returns 
 */
export function validateEmailFormat(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Función para enviar respuestas JSON consistentes  (Estándar).
 * 
 * @param {object} res - Objeto de respuesta de Express.
 * @param {number} statusCode - Código de estado HTTP de la respuesta.
 * @param {boolean} [error=false] - Indica si la respuesta es un error (opcional, por defecto es false).
 * @param {string} message - Mensaje de la respuesta.
 * @param {Array|null} data - Datos para incluir en la respuesta (opcional).
 * @param {object|null} otherData - Otros datos para incluir en la respuesta (opcional).
 * @returns {object} Objeto de respuesta JSON.
 */
export function sendResponse(res, statusCode, error=false, message, data = null, otherData=null) {
    const responseData = {
        error: error ? true : false,
        statusCode: statusCode,
        message: message
    };
    if (data) {
        responseData.data = data;
    }
    if (otherData) {
        Object.assign(responseData, otherData);
    }
    return res.status(statusCode).json(responseData);
}

/**
 * Compare a password with a password hash
 * @param {string} password The plain text password to compare
 * @param {string} hashedPassword The hashed password stored in the database
 * @returns {boolean} True if the password matches the hash, false otherwise
 */
export async function comparePassword(password, hashedPassword) {
    try {
        // Compare the provided password with the stored hashed password
        const match = await bcrypt.compare(password, hashedPassword);
        return match;
    } catch (error) {
        console.error('Error comparing passwords:', error);
        throw error;
    }
}

/**
 * Generar codigo numerico de 6 digitos
 * @returns 
 */
export function generate_6_digitRandomNumericCode() {
    const code = Math.floor(100000 + Math.random() * 900000);
    return code.toString();
}

/**
 * Genera un código único compuesto por una combinación de números y letras.
 * @returns {string} Código único generado en el formato "numbers-letters".
 */
export const generateUniqueCode = () => {
    const uuid = uuidv4();
    const numeros = uuid.substring(0, 6).replace(/-/g, ''); 
    const letras = uuid.substring(6, 12).replace(/-/g, ''); 
    return `${numeros}-${letras}`;
}

/**
 * Calcular el porcentaje de cambio entre dos valores.
 * @param {number} current - Valor actual.
 * @param {number} previous - Valor anterior.
 * @returns {number} - Porcentaje de cambio.
 */
export const calculatePercentageChange = (current, previous) => {
    if (previous === 0) {
        return current === 0 ? 0 : 100;
    }
    return ((current - previous) / previous) * 100;
};

/**
 * Redondear un valor hacia abajo a dos decimales.
 * 
 * Esta función toma un número y lo redondea hacia abajo a dos decimales.
 * 
 * @param {number} value - El valor numérico que se desea redondear.
 * @returns {number} - El valor redondeado a dos decimales.
 * 
 * @example
 * // Devuelve 12.34
 * roundDownToTwoDecimals(12.3456);
 */
export const roundDownToTwoDecimals = (value) => Math.floor(value * 100) / 100;



/**
 * Calcular la fecha de expiración de un pago.
 * 
 * Esta función calcula la fecha de expiración en formato Unix time dependiendo del método de pago 
 * y si es expirable. Para métodos de pago con tarjeta, el tiempo de expiración es de 7 días. 
 * Para otros métodos de pago, es de 2 semanas.
 * 
 * @param {string} paymentMethod - El método de pago (ej. 'card', 'bank', 'paypal', etc.).
 * @param {boolean} isExpirable - Indica si el método de pago es expirable o no.
 * @returns {number|null} - La fecha de expiración en Unix time. Si no es expirable, devuelve `null`.
 * 
 * @example
 * -- Devuelve una fecha de expiración en Unix time para un pago con tarjeta (7 días desde hoy)
 * calculateExpirationDate('card', true);
 * 
 * @example
 * -- Devuelve una fecha de expiración en Unix time para otro método de pago expirable (14 días desde hoy)
 * calculateExpirationDate('bank', true);
 * 
 * @example
 * -- Devuelve null porque el método de pago no es expirable
 * calculateExpirationDate('paypal', false);
 */
export const calculateExpirationDate = (paymentMethod, isExpirable) => {
    const SECONDS_IN_DAY = 86400; // 24 hours in seconds
    const SECONDS_IN_WEEK = SECONDS_IN_DAY * 7; // 7 days in seconds
    let expirationInSeconds;

    // Si el método de pago es una tarjeta y es expirable
    if (paymentMethod === 'card' && isExpirable) {
        expirationInSeconds = SECONDS_IN_DAY * 7; // 7 días
    } 
    // Para otros métodos de pago expirable
    else if (isExpirable) {
        expirationInSeconds = SECONDS_IN_WEEK * 2; // 2 semanas
    } else {
        return null; // No expira si no es expirable
    }

    // Obtener la fecha actual en Unix timestamp
    const currentUnixTime = Math.floor(Date.now() / 1000);

    // Fecha de expiración calculada en Unix timestamp
    const expirationUnixTime = currentUnixTime + expirationInSeconds;

    // Si necesitas ajustar la expiración para ciertos casos de redes de tarjetas
    // if (paymentMethod === 'card' && needShorterExpiration) {
    //     expirationUnixTime = currentUnixTime + SECONDS_IN_DAY * 3; // Ejemplo: Red que requiere 3 días
    // }

    return expirationUnixTime;
}

