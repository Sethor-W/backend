import bcrypt from 'bcrypt';



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