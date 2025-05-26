import {
    sendResponse,
    validateRequiredFields,
} from "../../helpers/utils.js";
import axios from "axios";
import { OneClickCard } from "../../models/client/oneClickCard.js";
import { User } from "../../models/client/users.js";

// Constantes para las URL de API
const BASE_URL = process.env.TRANSBANK_BASE_URL;

export class OneClickTransbankController {

    /**
     * @swagger
     * /api/v1/payment/transbank/oneclick/inscriptions:
     *   post:
     *     summary: Create a OneClick inscription in Transbank
     *     tags: [Payments]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - username
     *               - email
     *             properties:
     *               username:
     *                 type: string
     *                 description: User identifier
     *               email:
     *                 type: string
     *                 format: email
     *                 description: User email
     *     responses:
     *       200:
     *         description: Inscription created successfully
     *       400:
     *         description: Validation errors
     *       500:
     *         description: Server error
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
     * @swagger
     * /api/v1/payment/transbank/oneclick/inscriptions/{token}:
     *   put:
     *     summary: Confirm a OneClick inscription in Transbank
     *     tags: [Payments]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: token
     *         required: true
     *         schema:
     *           type: string
     *         description: Inscription token provided by Transbank
     *     responses:
     *       200:
     *         description: Inscription confirmed successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 response_code:
     *                   type: number
     *                   description: Authorization response code (0 = Approved)
     *                 tbk_user:
     *                   type: string
     *                   description: Unique identifier for the OneClick inscription
     *                 authorization_code:
     *                   type: string
     *                   description: Authorization code for the inscription
     *                 card_type:
     *                   type: string
     *                   description: Type of card (Visa, MasterCard, etc.)
     *                 card_number:
     *                   type: string
     *                   description: Last 4 digits of the card
     *       400:
     *         description: Token is required
     *       500:
     *         description: Server error
     */
    // PUT payment/transbank/oneclick/inscriptions/{token}
    static async confirmInscription(req, res) {
        try {
            const { token } = req.params;
            const { userId, username } = req.body;
            
            if (!token) {
                return sendResponse(res, 400, true, "El token de inscripción es requerido");
            }

            if (!userId) {
                return sendResponse(res, 400, true, "El userId es requerido");
            }

            // Verificar que el usuario exista
            const user = await User.findByPk(userId);
            if (!user) {
                return sendResponse(res, 404, true, "Usuario no encontrado");
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

            // Realizar petición a Transbank con cuerpo vacío
            const response = await axios.put(
                `${BASE_URL}/rswebpaytransaction/api/oneclick/v1.2/inscriptions/${token}`,
                {},
                { headers }
            );

            // Validar el código de respuesta
            if (response.data.response_code !== 0) {
                const errorMessages = {
                    '-1': 'Tarjeta inválida',
                    '-2': 'Error de conexión',
                    '-3': 'Excede monto máximo',
                    '-4': 'Fecha de expiración inválida',
                    '-5': 'Problema en autenticación',
                    '-6': 'Rechazo general',
                    '-7': 'Tarjeta bloqueada',
                    '-8': 'Tarjeta vencida',
                    '-9': 'Transacción no soportada',
                    '-10': 'Problema en la transacción',
                    '-11': 'Excede límite de reintentos de rechazos'
                };

                const errorMessage = errorMessages[response.data.response_code] || 'Error desconocido en la transacción';
                return sendResponse(res, 400, true, errorMessage, response.data);
            }

            // Guardar la tarjeta en la base de datos
            const cardData = {
                tbk_user: response.data.tbk_user,
                userId: userId,
                username: userId,
                card_type: response.data.card_type,
                last4_card_digits: response.data.card_number,
                authorization_code: response.data.authorization_code
            };

            await OneClickCard.create(cardData);

            // Devolver respuesta al cliente
            return sendResponse(res, 200, false, "Inscripción confirmada exitosamente", response.data);
        } catch (error) {
            console.error("Error al confirmar inscripción en Transbank:", error);
            
            // Si hay una respuesta específica de error de Transbank, devolver esa información
            if (error.response) {
                if (error.response.data?.error_message === "Timeout exceeded for method finishInscription") {
                    return sendResponse(res, 400, true, "Tiempo de espera excedido al finalizar la inscripción, por favor intente nuevamente", {
                        data: { error_message: "Timeout exceeded for method finishInscription" },
                        error: true,
                        message: "Tiempo de espera excedido al finalizar la inscripción, por favor intente nuevamente",
                        statusCode: 400
                    });
                }
                return sendResponse(res, error.response.status, true, "Error al confirmar la inscripción en Transbank", error.response.data);
            }
            
            return sendResponse(res, 500, true, "No se pudo confirmar la inscripción");
        }
    }

    /**
     * @swagger
     * /api/v1/payment/transbank/oneclick/inscriptions:
     *   delete:
     *     summary: Delete a OneClick inscription in Transbank
     *     tags: [Payments]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - tbk_user
     *               - username
     *             properties:
     *               tbk_user:
     *                 type: string
     *                 description: Transbank user identifier
     *               username:
     *                 type: string
     *                 description: User identifier
     *     responses:
     *       204:
     *         description: Inscription deleted successfully
     *       400:
     *         description: Validation errors
     *       500:
     *         description: Server error
     */
    // DELETE payment/transbank/oneclick/inscriptions
    static async deleteInscription(req, res) {
        try {
            // Validar campos requeridos
            const requiredFields = ["tbk_user", "username"];
            const validationError = validateRequiredFields(req.body, requiredFields);
            
            if (validationError.length > 0) {
                return sendResponse(res, 400, true, `Campos requeridos faltantes: ${validationError.join(", ")}`);
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

            // Realizar petición a Transbank para eliminar la inscripción
            const response = await axios.delete(
                `${BASE_URL}/rswebpaytransaction/api/oneclick/v1.2/inscriptions`,
                { 
                    headers,
                    data: { tbk_user, username }
                }
            );

            // Si la respuesta es exitosa (204), eliminar la tarjeta de la base de datos
            if (response.status === 204) {
                await OneClickCard.destroy({
                    where: { tbk_user, username }
                });
                
                return sendResponse(res, 204, false, "Inscripción eliminada exitosamente");
            }

        } catch (error) {
            console.error("Error al eliminar inscripción en Transbank:", error);
            
            // Manejar errores específicos de Transbank
            if (error.response) {
                return sendResponse(res, error.response.status, true, "Error al eliminar la inscripción en Transbank", error.response.data);
            }
            
            return sendResponse(res, 500, true, "Error interno al procesar la eliminación de la inscripción");
        }
    }

    /**
     * @swagger
     * /api/v1/payment/transbank/oneclick/authorize:
     *   post:
     *     summary: Authorize a transaction with OneClick in Transbank
     *     tags: [Payments]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - username
     *               - tbk_user
     *               - buy_order
     *               - details
     *             properties:
     *               username:
     *                 type: string
     *                 description: User identifier
     *               tbk_user:
     *                 type: string
     *                 description: Transbank user identifier
     *               buy_order:
     *                 type: string
     *                 description: Order identifier
     *               details:
     *                 type: array
     *                 description: Transaction details
     *                 items:
     *                   type: object
     *                   required:
     *                     - commerce_code
     *                     - buy_order
     *                     - amount
     *                     - installments_number
     *                   properties:
     *                     commerce_code:
     *                       type: string
     *                       description: Commerce code
     *                     buy_order:
     *                       type: string
     *                       description: Order identifier for this detail
     *                     amount:
     *                       type: number
     *                       description: Amount to charge
     *                     installments_number:
     *                       type: integer
     *                       description: Number of installments
     *     responses:
     *       200:
     *         description: Transaction authorized successfully
     *       400:
     *         description: Validation errors
     *       500:
     *         description: Server error
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

    /**
     * @swagger
     * /api/v1/payment/transbank/oneclick/transactions/{buyOrder}:
     *   get:
     *     summary: Get the status of a OneClick transaction by buyOrder
     *     tags: [Payments]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: buyOrder
     *         required: true
     *         schema:
     *           type: string
     *         description: Order identifier to query
     *     responses:
     *       200:
     *         description: Transaction status retrieved successfully
     *       400:
     *         description: buyOrder is required
     *       500:
     *         description: Server error
     */
    // GET payment/transbank/oneclick/transactions/{buyOrder}
    static async getTransactionStatus(req, res) {
        try {
            const { buyOrder } = req.params;
            
            if (!buyOrder) {
                return sendResponse(res, 400, true, "El buyOrder es requerido");
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
            const response = await axios.get(
                `${BASE_URL}/rswebpaytransaction/api/oneclick/v1.2/transactions/${buyOrder}`,
                { headers }
            );

            // Devolver respuesta al cliente
            return sendResponse(res, 200, false, "Estado de la transacción obtenido exitosamente", response.data);
        } catch (error) {
            console.error("Error al obtener estado de la transacción en Transbank:", error);
            
            // Si hay una respuesta específica de error de Transbank, devolver esa información
            if (error.response) {
                return sendResponse(
                    res,
                    error.response.status,
                    true,
                    "Error al obtener el estado de la transacción en Transbank",
                    error.response.data
                );
            }
            
            return sendResponse(res, 500, true, "No se pudo obtener el estado de la transacción");
        }
    }

    /**
     * @swagger
     * /api/v1/payment/transbank/oneclick/cards/{userId}:
     *   get:
     *     summary: Get all registered cards for a specific user
     *     tags: [Payments]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: userId
     *         required: true
     *         schema:
     *           type: string
     *         description: User identifier to fetch their cards
     *     responses:
     *       200:
     *         description: Cards retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: boolean
     *                 message:
     *                   type: string
     *                 data:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       tbk_user:
     *                         type: string
     *                       card_type:
     *                         type: string
     *                       last4_card_digits:
     *                         type: string
     *                       authorization_code:
     *                         type: string
     *       404:
     *         description: User not found or no cards found
     *       500:
     *         description: Server error
     */
    // GET payment/transbank/oneclick/cards/{userId}
    static async getCardsByUserId(req, res) {
        try {
            const { userId } = req.params;

            if (!userId) {
                return sendResponse(res, 400, true, "El userId es requerido");
            }

            // Verificar que el usuario exista
            const user = await User.findByPk(userId);
            if (!user) {
                return sendResponse(res, 404, true, "Usuario no encontrado");
            }

            // Buscar todas las tarjetas asociadas al usuario
            const cards = await OneClickCard.findAll({
                where: { userId }
            });

            return sendResponse(res, 200, false, "Tarjetas obtenidas exitosamente", cards);
        } catch (error) {
            console.error("Error al obtener las tarjetas del usuario:", error);
            return sendResponse(res, 500, true, "Error al obtener las tarjetas del usuario");
        }
    }
}
