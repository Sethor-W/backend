import {
    sendResponse,
    validateRequiredFields,
} from "../../helpers/utils.js";
import axios from "axios";

// Constantes para las URL de API
const BASE_URL = process.env.TRANSBANK_BASE_URL;

export class OneClickTransbankController {

    /**
     * Crear una inscripción de usuario en OneClick de Transbank
     */
    // POST payment/transbank/oneclick/inscriptions
    static async createInscription(req, res) {
        try {
            // Validar campos requeridos
            const requiredFields = ["username", "email"];
            const validationError = validateRequiredFields(req.body, requiredFields);
            
            if (validationError.length > 0) {
                return sendResponse(res, 400, true, validationError);
            }

            const { username, email } = req.body;

            // Preparar los headers para la petición a Transbank
            const headers = {
                "Tbk-Api-Key-Id": process.env.TRANSBANK_API_KEY_ID || "",
                "Tbk-Api-Key-Secret": process.env.TRANSBANK_API_KEY_SECRET || "",
                "Content-Type": "application/json",
                "User-Agent": "PostmanRuntime/7.43.2",
                "Accept": "*/*",
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive"
            };

            // Realizar petición a Transbank
            const response = await axios.post(
                `${BASE_URL}/rswebpaytransaction/api/oneclick/v1.2/inscriptions`,
                {
                    username,
                    email,
                    response_url: process.env.TRANSBANK_ONE_CLICK_RESPONSE_URL
                },
                { headers }
            );

            // Devolver respuesta al cliente
            return sendResponse(res, 200, false, "Inscripción creada exitosamente", response.data);
        } catch (error) {
            console.error("Error al crear inscripción en Transbank:", error);
            
            // Si hay una respuesta específica de error de Transbank, devolver esa información
            if (error.response) {
                return sendResponse(res, error.response.status, true, "Error al procesar la solicitud en Transbank", error.response.data);
            }
            
            return sendResponse(res, 500, true, "No se pudo crear la inscripción");
        }
    }

    /**
     * Confirmar una inscripción de usuario en OneClick de Transbank
    */
    // PUT payment/transbank/oneclick/inscriptions/{token}
    static async confirmInscription(req, res) {
        try {
            const { token } = req.params;
            
            if (!token) {
                return sendResponse(res, 400, true, "El token de inscripción es requerido");
            }

            // Preparar los headers para la petición a Transbank
            const headers = {
                "Tbk-Api-Key-Id": process.env.TRANSBANK_API_KEY_ID || "",
                "Tbk-Api-Key-Secret": process.env.TRANSBANK_API_KEY_SECRET || "",
                "Content-Type": "application/json",
                "User-Agent": "PostmanRuntime/7.43.2",
                "Accept": "*/*",
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive"
            };

            // Realizar petición a Transbank
            const response = await axios.put(
                `${BASE_URL}/rswebpaytransaction/api/oneclick/v1.2/inscriptions/${token}`,
                {},
                { headers }
            );

            // Devolver respuesta al cliente
            return sendResponse(res, 200, false, "Inscripción confirmada exitosamente", response.data);
        } catch (error) {
            console.error("Error al confirmar inscripción en Transbank:", error);
            
            // Si hay una respuesta específica de error de Transbank, devolver esa información
            if (error.response) {
                return sendResponse(
                    res,
                    error.response.status,
                    true,
                    "Error al confirmar la inscripción en Transbank",
                    error.response.data
                );
            }
            
            return sendResponse(res, 500, true, "No se pudo confirmar la inscripción");
        }
    }

    /**
     * Eliminar una inscripción de usuario en OneClick de Transbank
    */
    // DELETE payment/transbank/oneclick/inscriptions
    static async deleteInscription(req, res) {
        try {
            // Validar campos requeridos
            const requiredFields = ["tbk_user", "username"];
            const validationError = validateRequiredFields(req.body, requiredFields);
            
            if (validationError.length > 0) {
                return sendResponse(res, 400, true, validationError);
            }

            const { tbk_user, username } = req.body;

            // Preparar los headers para la petición a Transbank
            const headers = {
                "Tbk-Api-Key-Id": process.env.TRANSBANK_API_KEY_ID || "",
                "Tbk-Api-Key-Secret": process.env.TRANSBANK_API_KEY_SECRET || "",
                "Content-Type": "application/json",
                "User-Agent": "PostmanRuntime/7.43.2",
                "Accept": "*/*",
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive"
            };

            // Realizar petición a Transbank
            const response = await axios.delete(
                `${BASE_URL}/rswebpaytransaction/api/oneclick/v1.2/inscriptions`,
                { 
                    headers,
                    data: {
                        tbk_user,
                        username
                    }
                }
            );

            // Devolver respuesta al cliente
            return sendResponse(res, 200, false, "Inscripción eliminada exitosamente", response.data);
        } catch (error) {
            console.error("Error al eliminar inscripción en Transbank:", error);
            
            // Si hay una respuesta específica de error de Transbank, devolver esa información
            if (error.response) {
                return sendResponse(
                    res,
                    error.response.status,
                    true,
                    "Error al eliminar la inscripción en Transbank",
                    error.response.data
                );
            }
            
            return sendResponse(res, 500, true, "No se pudo eliminar la inscripción");
        }
    }

    /**
     * Autorizar una transacción con OneClick de Transbank
    */
    // POST payment/transbank/oneclick/authorize
    static async authorizeTransaction(req, res) {
        try {
            // Validar campos requeridos
            const requiredFields = ["username", "tbk_user", "buy_order", "details"];
            const validationError = validateRequiredFields(req.body, requiredFields);
            
            if (validationError.length > 0) {
                return sendResponse(res, 400, true, validationError);
            }

            // Validar que details sea un array y tenga al menos un elemento
            if (!Array.isArray(req.body.details) || req.body.details.length === 0) {
                return sendResponse(res, 400, true, "El campo 'details' debe ser un array con al menos un elemento");
            }

            // Validar campos requeridos en cada detalle
            const detailRequiredFields = ["commerce_code", "buy_order", "amount", "installments_number"];
            for (const detail of req.body.details) {
                const detailValidationError = validateRequiredFields(detail, detailRequiredFields);
                if (detailValidationError.length > 0) {
                    return sendResponse(res, 400, true, `Error en details: ${detailValidationError}`);
                }
            }

            const { username, tbk_user, buy_order, details } = req.body;

            // Preparar los headers para la petición a Transbank
            const headers = {
                "Tbk-Api-Key-Id": process.env.TRANSBANK_API_KEY_ID || "",
                "Tbk-Api-Key-Secret": process.env.TRANSBANK_API_KEY_SECRET || "",
                "Content-Type": "application/json",
                "User-Agent": "PostmanRuntime/7.43.2",
                "Accept": "*/*",
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive"
            };

            // Realizar petición a Transbank
            const response = await axios.post(
                `${BASE_URL}/rswebpaytransaction/api/oneclick/v1.2/transactions`,
                {
                    username,
                    tbk_user,
                    buy_order,
                    details
                },
                { headers }
            );

            // Devolver respuesta al cliente
            return sendResponse(res, 200, false, "Transacción autorizada exitosamente", response.data);
        } catch (error) {
            console.error("Error al autorizar transacción en Transbank:", error);
            
            // Si hay una respuesta específica de error de Transbank, devolver esa información
            if (error.response) {
                return sendResponse(
                    res,
                    error.response.status,
                    true,
                    "Error al procesar la transacción en Transbank",
                    error.response.data
                );
            }
            
            return sendResponse(res, 500, true, "No se pudo autorizar la transacción");
        }
    }
}
