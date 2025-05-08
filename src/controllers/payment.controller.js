// import {
//     body,
//     param,
//     query,
//     validationResult
// } from "express-validator";
// import {
//     sendResponse
// } from "../helpers/utils.js";

// import {
//     User
// } from "../models/client/users.js";
// import {
//     Profile
// } from "../models/client/profile.js";
// import axios from "axios";
// import CryptoJS from "crypto-js";
// import {
//     generateInvoicePrefix,
//     makeRequest
// } from "../helpers/payment.helper.js";
// import { Business } from "../models/common/business.js";

// async function getInfoCustomerId(userId) {
//     const profile = await Profile.findOne({ userId: { userId } });
//     if (!profile) {
//         return sendResponse(res, 401, true, 'Usuario no encontrado');
//     }

//     return profile?.PSPCustomerId
// }

// export class PaymentController {

//     /************************************************************************************************
//      ************************************************************************************************
//      *                                          CUSTOMER
//      ************************************************************************************************
//      ************************************************************************************************/


//     /**
//      * @swagger
//      * /api/v1/payment/customers:
//      *   post:
//      *     summary: Create a customer profile for payment methods
//      *     tags: [Payments]
//      *     security:
//      *       - bearerAuth: []
//      *     requestBody:
//      *       required: true
//      *       content:
//      *         application/json:
//      *           schema:
//      *             type: object
//      *             required:
//      *               - name
//      *               - email
//      *             properties:
//      *               name:
//      *                 type: string
//      *                 description: Customer name
//      *               email:
//      *                 type: string
//      *                 format: email
//      *                 description: Customer email
//      *               invoice_prefix:
//      *                 type: string
//      *                 description: Optional prefix for invoices
//      *     responses:
//      *       200:
//      *         description: Customer created successfully
//      *       400:
//      *         description: Validation errors
//      *       500:
//      *         description: Server error
//      * 
//      * Create Customer
//      * Create a customer profile to save the payment methods a customer can use.
//      * 
//      * POST /payment/customers
//      */
//     static async createCustomer(req, res) {
//         // Validaciones
//         await body('invoice_prefix').optional().isString().withMessage('Invoice prefix must be a string').run(req);
//         await body('name').isString().notEmpty().withMessage('Name is required').run(req);
//         await body('email').isEmail().withMessage('Valid email is required').run(req);

//         // Verifica los errores de validación
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return sendResponse(res, 400, true, 'Errores de validación', errors.array());
//         }

//         // Extrae los datos de la solicitud
//         const { email, invoice_prefix, name, ...bodyReq } = req.body;

//         try {
//             const httpMethod = 'POST';
//             const urlPath = '/v1/customers';
//             const body = {
//                 email,
//                 invoice_prefix: invoice_prefix || generateInvoicePrefix(name),
//                 name,
//                 metadata: {
//                     merchant_defined: true
//                 },
//                 ...bodyReq,
//             };

//             // Realiza la solicitud con makeRequest
//             const response = await makeRequest(httpMethod, urlPath, body);

//             // Responde al cliente con la data obtenida
//             return sendResponse(res, 200, false, "Customer created successfully", response.body, { status: response.body.status });

//         } catch (error) {
//             console.error("Error al crear el customer:", error);
//             return sendResponse(res, error.statusCode || 500, true, "Error al crear el customer", error.message || error.body || "Unknown error");
//         }
//     }

//     /**
//      * @swagger
//      * /api/v1/payment/customers/{customer}:
//      *   post:
//      *     summary: Update a customer profile
//      *     tags: [Payments]
//      *     security:
//      *       - bearerAuth: []
//      *     parameters:
//      *       - in: path
//      *         name: customer
//      *         required: true
//      *         schema:
//      *           type: string
//      *         description: Customer ID
//      *     requestBody:
//      *       required: true
//      *       content:
//      *         application/json:
//      *           schema:
//      *             type: object
//      *             properties:
//      *               name:
//      *                 type: string
//      *                 description: Customer name
//      *               email:
//      *                 type: string
//      *                 format: email
//      *                 description: Customer email
//      *               default_payment_method:
//      *                 type: string
//      *                 description: Default payment method ID
//      *     responses:
//      *       200:
//      *         description: Customer updated successfully
//      *       400:
//      *         description: Validation errors
//      *       500:
//      *         description: Server error
//      * 
//      * Update Customer
//      * Change one or more fields in a customer profile.
//      * To clear a field, set it to an empty string.
//      * 
//      * POST /payment/customers/:customer
//      */
//     static async updateCustomer(req, res) {
//         // Validaciones
//         await body('default_payment_method').optional().isString().withMessage('The payment method that is used when the transaction does not specify a payment method. String starting with card_ or other_.').run(req);
//         await body('name').optional().isString().withMessage('Name is required').run(req);
//         await body('email').optional().isEmail().withMessage('Valid email is required').run(req);

//         // Verifica los errores de validación
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return sendResponse(res, 400, true, 'Errores de validación', errors.array());
//         }

//         // Extrae los datos de la solicitud
//         const { customer } = req.params;
//         const { email, name, default_payment_method, ...bodyReq } = req.body;

//         try {
//             const httpMethod = 'POST';
//             const urlPath = `/v1/customers/${customer}`;
//             const body = {
//                 email,
//                 default_payment_method,
//                 name,
//                 ...bodyReq,
//             };

//             // Realiza la solicitud con makeRequest
//             const response = await makeRequest(httpMethod, urlPath, body);

//             // Responde al cliente con la data obtenida
//             return sendResponse(res, 200, false, "Customer updated successfully", response.body, { status: response.body.status });

//         } catch (error) {
//             console.error("Error al actualizar el customer:", error);
//             return sendResponse(res, error.statusCode || 500, true, "Error al actualizar el customer", error.message || error.body || "Unknown error");
//         }
//     }

//     /**
//      * @swagger
//      * /api/v1/payment/customers/{customer}:
//      *   get:
//      *     summary: Retrieve customer information
//      *     tags: [Payments]
//      *     security:
//      *       - bearerAuth: []
//      *     parameters:
//      *       - in: path
//      *         name: customer
//      *         required: true
//      *         schema:
//      *           type: string
//      *         description: Customer ID
//      *     responses:
//      *       200:
//      *         description: Customer retrieved successfully
//      *       500:
//      *         description: Server error
//      * 
//      * Retrieve Customer
//      * Change one or more fields in a customer profile.
//      * To clear a field, set it to an empty string.
//      * 
//      * POST /payment/customers/:customer
//      */
//     static async retrieveCustomer(req, res) {
//         const { userId } = req.user;
//         const { customer } = req.params;

//         try {
//             const PSPCustomerId = await getInfoCustomerId(userId);

//             const httpMethod = 'GET';
//             // const urlPath = `/v1/customers/${customer}`;
//             const urlPath = `/v1/customers/${PSPCustomerId}`;

//             // Realiza la solicitud con makeRequest
//             const response = await makeRequest(httpMethod, urlPath);

//             // Responde al cliente con la data obtenida
//             return sendResponse(res, 200, false, "Customer retrieved successfully", response.body.data, { status: response.body.status });

//         } catch (error) {
//             console.error("Error al recuperar el customer:", error);
//             return sendResponse(res, error.statusCode || 500, true, "Error al recuperar el customer", error.message || error.body || "Unknown error");
//         }
//     }



//     /************************************************************************************************
//      ************************************************************************************************
//      *                                    CUSTOMER PAYMENT METHOD
//      ************************************************************************************************
//      ************************************************************************************************/


//     /**
//      * @swagger
//      * /api/v1/payment/cards/{customer}:
//      *   post:
//      *     summary: Creates a card token for a customer
//      *     tags: [Payments]
//      *     security:
//      *       - bearerAuth: []
//      *     parameters:
//      *       - in: path
//      *         name: customer
//      *         required: true
//      *         schema:
//      *           type: string
//      *         description: Customer ID
//      *     requestBody:
//      *       required: true
//      *       content:
//      *         application/json:
//      *           schema:
//      *             type: object
//      *             required:
//      *               - number
//      *               - exp_month
//      *               - exp_year
//      *               - cvc
//      *             properties:
//      *               number:
//      *                 type: string
//      *                 description: Card number
//      *               exp_month:
//      *                 type: string
//      *                 description: Expiration month (MM)
//      *               exp_year:
//      *                 type: string
//      *                 description: Expiration year (YYYY)
//      *               cvc:
//      *                 type: string
//      *                 description: Card security code
//      *     responses:
//      *       200:
//      *         description: Card token created successfully
//      *       400:
//      *         description: Validation errors
//      *       500:
//      *         description: Server error
//      * 
//      * Create Card Token
//      * Create a card token that we can use for future transactions for a customer.
//      * 
//      * POST /payment/cards/:customer
//      */
//     static async createCardToken(req, res) {
//         const { userId } = req.user;
//         const { customer, country = 'gb', language = 'es', ...bodyReq } = req.body;

//         try {
//             // const profile = await Profile.findOne({ userId: { userId } });
//             // if (!profile) {
//             //     return sendResponse(res, 401, true, 'Usuario no encontrado');
//             // }

//             // const PSPCustomerId = profile.PSPCustomerId
//             const PSPCustomerId = await getInfoCustomerId(userId);

//             const httpMethod = 'POST';
//             const urlPath = '/v1/hosted/collect/card';
//             const body = {
//                 country: country,
//                 customer: PSPCustomerId,
//                 language: language,
//                 ...bodyReq
//             };

//             // Realiza la solicitud con makeRequest
//             const response = await makeRequest(httpMethod, urlPath, body);

//             // Responde al cliente con la data obtenida
//             return sendResponse(res, 200, false, "Url para crear el token creado exitosamente", response.body.data, { status: response.body.status });

//         } catch (error) {
//             console.error("Error al crear el token de la tarjeta:", error);
//             return sendResponse(res, error.statusCode || 500, true, "Error al crear el token de la tarjeta", error.body || error);
//         }
//     }
//     // static async createCardToken(req, res) {
//     //     // Validaciones
//     //     await body('customer').isString().notEmpty().withMessage('Customer ID is required').run(req);
//     //     await body('country').optional().isISO31661Alpha2().withMessage('Invalid country code. The two-letter ISO 3166-1 ALPHA-2 code for the country.').run(req);

//     //     // Verifica los errores de validación
//     //     const errors = validationResult(req);
//     //     if (!errors.isEmpty()) {
//     //         return sendResponse(res, 400, true, 'Errores de validación', errors.array());
//     //     }

//     //     const { customer, country = 'gb', language = 'es', ...bodyReq } = req.body;

//     //     try {

//     //         const httpMethod = 'POST';
//     //         const urlPath = '/v1/hosted/collect/card';
//     //         const body = {
//     //             country: country,
//     //             customer: customer,
//     //             language: language,
//     //             ...bodyReq
//     //         };

//     //         // Realiza la solicitud con makeRequest
//     //         const response = await makeRequest(httpMethod, urlPath, body);

//     //         // Responde al cliente con la data obtenida
//     //         return sendResponse(res, 200, false, "Url para crear el token creado exitosamente", response.body.data, { status: response.body.status });

//     //     } catch (error) {
//     //         console.error("Error al crear el token de la tarjeta:", error);
//     //         return sendResponse(res, error.statusCode || 500, true, "Error al crear el token de la tarjeta", error.body || error);
//     //     }
//     // }


//     /**
//      * @swagger
//      * /api/v1/payment/cards/{customer}:
//      *   get:
//      *     summary: Retrieve customer's payment methods
//      *     tags: [Payments]
//      *     security:
//      *       - bearerAuth: []
//      *     parameters:
//      *       - in: path
//      *         name: customer
//      *         required: true
//      *         schema:
//      *           type: string
//      *         description: Customer ID
//      *     responses:
//      *       200:
//      *         description: Payment methods retrieved successfully
//      *       500:
//      *         description: Server error
//      * 
//      * Retrieve payment methods
//      * Retrieves a list of all payment methods for a customer.
//      * 
//      * GET /payment/cards/:customer
//      */
//     static async retrievePaymentMethods(req, res) {
//         const { userId } = req.user;
//         const { customer } = req.params;

//         try {
//             const PSPCustomerId = await getInfoCustomerId(userId);

//             const httpMethod = 'GET';
//             // const urlPath = `/v1/customers/${customer}/payment_methods`;
//             const urlPath = `/v1/customers/${PSPCustomerId}/payment_methods`;
//             const body = {
//                 // ...bodyReq,
//             };

//             // Realiza la solicitud con makeRequest
//             const response = await makeRequest(httpMethod, urlPath, body);

//             // Responde al cliente con la data obtenida
//             return sendResponse(res, 200, false, "Payment method get successfully", response.body.data, { status: response.body.status });

//         } catch (error) {
//             console.error("Error al obtener métodos de pago:", error);
//             return sendResponse(res, error.statusCode || 500, true, "Error al obtener métodos de pago", error.message || error.body || "Unknown error");
//         }
//     }

//     /**
//      * Add Payment Method to Customer
//      * Add a payment method to a customer profile (card on file).
//      * 
//      * POST /payment/customers/:customer/payment_methods
//      */
//     static async addPaymentMethodOfCustomer(req, res) {
//         // Validaciones
//         await body('type').optional().isString().withMessage('Payment method type must be a string').run(req);
//         await body('token').optional().isString().withMessage('Token must be a string').run(req);

//         // Validación personalizada para 'type' o 'token'
//         await body().custom((value, { req }) => {
//             const { type, token } = req.body;
//             if ((type && token) || (!type && !token)) {
//                 throw new Error("You must set only one of the following parameters: 'type' or 'token'.");
//             }
//             return true;
//         }).run(req);

//         // Verifica los errores de validación
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return sendResponse(res, 400, true, 'Errores de validación', errors.array());
//         }

//         const { customer } = req.params;
//         const { ...bodyReq } = req.body;

//         try {
//             const httpMethod = 'POST';
//             const urlPath = `/v1/customers/${customer}/payment_methods`;
//             const body = {
//                 ...bodyReq,
//                 fields: {
//                     language: 'es',
//                 }
//             };

//             // Realiza la solicitud con makeRequest
//             const response = await makeRequest(httpMethod, urlPath, body);

//             // Responde al cliente con la data obtenida
//             return sendResponse(res, 200, false, "Payment method added successfully", response.body.data, { status: response.body.status });

//         } catch (error) {
//             console.error("Error al agregar el método de pago:", error);
//             return sendResponse(res, error.statusCode || 500, true, "Error al agregar el método de pago", error.message || error.body || "Unknown error");
//         }
//     }

//     /**
//      * List Payment Methods of Customer
//      * List all the payment methods of a customer.
//      * 
//      * GET /payment/customers/PSPCustomerId/payment_methods
//      */
//     static async listPaymentMethodsOfCustomer(req, res) {
//         const { userId } = req.user;
//         const { customer } = req.params;
//         const { ...bodyReq } = req.body;

//         try {
//             const PSPCustomerId = await getInfoCustomerId(userId);

//             const httpMethod = 'GET';
//             // const urlPath = `/v1/customers/${customer}/payment_methods`;
//             const urlPath = `/v1/customers/${PSPCustomerId}/payment_methods`;
//             const body = {
//                 ...bodyReq,
//             };

//             // Realiza la solicitud con makeRequest
//             const response = await makeRequest(httpMethod, urlPath, body);

//             // Responde al cliente con la data obtenida
//             return sendResponse(res, 200, false, "Payment method get successfully", response.body.data, { status: response.body.status });

//         } catch (error) {
//             console.error("Error al obtener métodos de pago:", error);
//             return sendResponse(res, error.statusCode || 500, true, "Error al obtener métodos de pago", error.message || error.body || "Unknown error");
//         }
//     }
//     // static async listPaymentMethodsOfCustomer(req, res) {
//     //     const { customer } = req.params;
//     //     const { ...bodyReq } = req.body;

//     //     try {
//     //         const httpMethod = 'GET';
//     //         const urlPath = `/v1/customers/${customer}/payment_methods`;
//     //         const body = {
//     //             ...bodyReq,
//     //         };

//     //         // Realiza la solicitud con makeRequest
//     //         const response = await makeRequest(httpMethod, urlPath, body);

//     //         // Responde al cliente con la data obtenida
//     //         return sendResponse(res, 200, false, "Payment method get successfully", response.body.data, { status: response.body.status });

//     //     } catch (error) {
//     //         console.error("Error al obtener métodos de pago:", error);
//     //         return sendResponse(res, error.statusCode || 500, true, "Error al obtener métodos de pago", error.message || error.body || "Unknown error");
//     //     }
//     // }

//     /**
//      * Delete Payment Method
//      * Delete a payment method from a customer profile.
//      * 
//      * DELETE /payment/customers/:customer/payment_methods/:payment_method
//      */
//     static async deletePaymentMethod(req, res) {
//         const { userId } = req.user;
//         const { customer, payment_method } = req.params;

//         try {
//             const PSPCustomerId = await getInfoCustomerId(userId);

//             const httpMethod = 'DELETE';
//             // const urlPath = `/v1/customers/${customer}/payment_methods/${payment_method}`;
//             const urlPath = `/v1/customers/${PSPCustomerId}/payment_methods/${payment_method}`;
            
//             // Realiza la solicitud con makeRequest
//             const response = await makeRequest(httpMethod, urlPath);

//             // Responde al cliente con la data obtenida
//             return sendResponse(res, 200, false, "Payment method deleted successfully", response.body.data, { status: response.body.status });

//         } catch (error) {
//             console.error("Error al eliminar el método pago:", error);
//             return sendResponse(res, error.statusCode || 500, true, "Error al eliminar el método de pago", error.message || error.body || "Unknown error");
//         }
//     }
//     // static async deletePaymentMethod(req, res) {
//     //     const { customer, payment_method } = req.params;

//     //     try {
//     //         const httpMethod = 'DELETE';
//     //         const urlPath = `/v1/customers/${customer}/payment_methods/${payment_method}`;

//     //         // Realiza la solicitud con makeRequest
//     //         const response = await makeRequest(httpMethod, urlPath);

//     //         // Responde al cliente con la data obtenida
//     //         return sendResponse(res, 200, false, "Payment method deleted successfully", response.body.data, { status: response.body.status });

//     //     } catch (error) {
//     //         console.error("Error al eliminar el método pago:", error);
//     //         return sendResponse(res, error.statusCode || 500, true, "Error al eliminar el método de pago", error.message || error.body || "Unknown error");
//     //     }
//     // }



//     /************************************************************************************************
//      ************************************************************************************************
//      *                                          PAYMENT
//      ************************************************************************************************
//      ************************************************************************************************/

//     /**
//      * @swagger
//      * /api/v1/payment/payments:
//      *   post:
//      *     summary: Create a payment
//      *     tags: [Payments]
//      *     security:
//      *       - bearerAuth: []
//      *     requestBody:
//      *       required: true
//      *       content:
//      *         application/json:
//      *           schema:
//      *             type: object
//      *             required:
//      *               - amount
//      *               - currency
//      *               - payment_method
//      *               - customer
//      *             properties:
//      *               amount:
//      *                 type: integer
//      *                 description: Amount to charge (in cents)
//      *               currency:
//      *                 type: string
//      *                 description: Currency code (e.g., usd)
//      *               payment_method:
//      *                 type: string
//      *                 description: Payment method ID
//      *               customer:
//      *                 type: string
//      *                 description: Customer ID
//      *     responses:
//      *       200:
//      *         description: Payment created successfully
//      *       400:
//      *         description: Validation errors
//      *       500:
//      *         description: Server error
//      * 
//      * Create Payment
//      * Charge a customer for service or product.
//      * 
//      * POST /payment/payments
//      */
//     static async createPayment(req, res) {
//         // Validaciones
//         await body('amount').isFloat({ min: 0 }).notEmpty().withMessage('Amount must be a positive number').run(req);
//         await body('currency').isString().isLength({ min: 3, max: 3 }).withMessage('Currency must be a three-letter ISO 4217 code').run(req);
//         await body('description').isString().notEmpty().withMessage('Payment method type must be a string').run(req);

//         // Verifica los errores de validación
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return sendResponse(res, 400, true, 'Errores de validación', errors.array());
//         }

//         const {
//             amount,
//             currency,
//             capture = true,
//             description = '',
//             receipt_email = '',
//             customer,
//             ...bodyReq
//         } = req.body;

//         try {

//             const httpMethod = 'POST';
//             const urlPath = `/v1/payments`;
//             const body = {
//                 amount,
//                 currency,
//                 capture, // Captura inmediata
//                 description,
//                 receipt_email,
//                 customer,
//                 ...bodyReq,
//             };
//             // console.log(body)

//             // Llama a la función independiente para crear el pago
//             const paymentResponse = await PaymentController.createPaymentHandleFuntion(body);


//             // // Realiza la solicitud con makeRequest
//             // const response = await makeRequest(httpMethod, urlPath, body);

//             // Responde al cliente con la data obtenida
//             return sendResponse(res, 200, false, "Payment created successfully", paymentResponse.body.data, { status: paymentResponse.body.status });

//         } catch (error) {
//             console.error("Error creating payment:", error);
//             return sendResponse(res, error.statusCode || 500, true, "Error creating payment", error.message || error.body || "Unknown error");
//         }
//     }


//     /**
//      * @swagger
//      * /api/v1/payment/payments/{payment}:
//      *   get:
//      *     summary: Retrieve payment information
//      *     tags: [Payments]
//      *     security:
//      *       - bearerAuth: []
//      *     parameters:
//      *       - in: path
//      *         name: payment
//      *         required: true
//      *         schema:
//      *           type: string
//      *         description: Payment ID
//      *     responses:
//      *       200:
//      *         description: Payment retrieved successfully
//      *       500:
//      *         description: Server error
//      * 
//      * Retrieve Payment
//      * Retrieves all details about a payment.
//      * 
//      * GET /payment/payments/:payment
//      */
//     static async retrievePayment(req, res) {
//         const { payment } = req.params;

//         try {
//             const httpMethod = 'GET';
//             const urlPath = `/v1/payments/${payment}`;

//             // Realiza la solicitud con makeRequest
//             const response = await makeRequest(httpMethod, urlPath);

//             // Responde al cliente con la data obtenida
//             return sendResponse(res, 200, false, "Payment retrieved successfully", response.body.data, { status: response.body.status });

//         } catch (error) {
//             console.error("Error retrieved payment:", error);
//             return sendResponse(res, error.statusCode || 500, true, "Error retrieved payment", error.message || error.body || "Unknown error");
//         }
//     }

    
//     /**
//      * List Payments
//      * 
//      * GET /payment/payments
//      */
//     static async listPayments(req, res) {
//         await query('customer').notEmpty().withMessage('The customer query parameter is required to filter the list for payments.').run(req);

//         // Verifica los errores de validación
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return sendResponse(res, 400, true, 'Validation errors', errors.array());
//         }

//         const { ...params } = req.query;

//         // Convierte los parámetros adicionales en una cadena de consulta
//         const searchParams = new URLSearchParams({ ...params }).toString();

//         try {
//             const httpMethod = 'GET';
//             const urlPath = `/v1/payments?${searchParams}`;

//             // Realiza la solicitud con makeRequest
//             const response = await makeRequest(httpMethod, urlPath);

//             // Responde al cliente con la data obtenida
//             return sendResponse(res, 200, false, "List Payments retrieved successfully", response.body.data, { status: response.body.status });

//         } catch (error) {
//             console.error("Error retrieved list payments:", error);
//             return sendResponse(res, error.statusCode || 500, true, "Error retrieved list payments", error.message || error.body || "Unknown error");
//         }
//     }



//     /************************************************************************************************
//      ************************************************************************************************
//      *                                          PAYOUT
//      ************************************************************************************************
//      ************************************************************************************************/


//     /**
//      * Create Payout
//      * Create a payout (disbursement).
//      * 
//      * POST /payment/payouts
//      */
//     static async createPayout(req, res) {

//         const { ...bodyReq } = req.body;

//         try {
//             const httpMethod = 'POST';
//             const urlPath = '/v1/payouts';
//             const body = {
//                 // ewallet: 'ewallet_090e1ef18c3aa754fd43cce9ee454858',
//                 // merchant_reference_id: 'GHY-0YU-HUJ-POI',
//                 // metadata: {
//                 //     merchant_defined: true
//                 // },
//                 ...bodyReq,
//             };

//             // Realiza la solicitud con makeRequest
//             const response = await makeRequest(httpMethod, urlPath, body);

//             // Responde al cliente con la data obtenida
//             return sendResponse(res, 200, false, "Payout created successfully", response.body.data, { status: response.body.status });

//         } catch (error) {
//             console.error("Error creating payout:", error);
//             return sendResponse(res, error.statusCode || 500, true, "Error creating payout", error.message || error.body || "Unknown error");
//         }

//     }

//     /**
//      * Confirm Payout with FX
//      * Confirm the exchange rate of a payout that involves foreign exchange.
//      * 
//      * POST /payment/payouts/confirm/:payout
//      */
//     static async confirmPayoutWithFX(req, res) {
//         const { payout } = req.params;

//         try {
//             const httpMethod = 'POST';
//             const urlPath = `/v1/payouts/confirm/${payout}`;
            
//             // Realiza la solicitud con makeRequest
//             const response = await makeRequest(httpMethod, urlPath);

//             // Responde al cliente con la data obtenida
//             return sendResponse(res, 200, false, "Confirm Payout with FX successfully", response.body.data, { status: response.body.status });

//         } catch (error) {
//             console.error("Error Confirming Payout with FX:", error);
//             return sendResponse(res, error.statusCode || 500, true, "Error Confirming Payout with FX", error.message || error.body || "Unknown error");
//         }

//     }











//     /**
//      * Crear un pyament
//      */
//     // POST business/products/:businessId/branch/:branchId
//     static async beneficiary(req, res) {

//         try {
//             const httpMethod = 'POST';
//             const urlPath = '/v1/payouts/beneficiary';
//             const body = {
//                 category: "bank",
//                 company_name: "All Star Limousine",
//                 country: "US",
//                 currency: "USD",
//                 entity_type: "company",
//                 identification_type: "company_registered_number",
//                 identification_value: "9876543210",
//                 merchant_reference_id: "AllStarLimo", // Fields from 'beneficiary_required_fields' in the response to 'Get Payout Method Type Required Fields'
//                 account_number: "0987654321",
//                 aba: "987654321",

//                 address: '456 Second Street',
//                 email: 'janedoe@rapyd.net',
//                 city: 'Anytown',
//                 postcode: '10101',
//                 bank_name: 'US General Bank',
//                 state: 'NY',
//                 identification_type: 'SSC',
//                 identification_value: '123456789',
//                 bic_swift: 'BUINBGSF',
//                 ach_code: '123456789'
//             };

//             // Realiza la solicitud con makeRequest
//             const response = await makeRequest(httpMethod, urlPath, body);

//             // Responde al cliente con la data obtenida
//             res.json(response.body);

//         } catch (error) {
//             console.error('Error:', error.response ? error.response.body : error.message);
//             res.status(error.response ? error.response.statusCode : 500).json({
//                 error: error
//             });
//         }

//     }


    



//     /************************************************************************************************
//      ************************************************************************************************
//      *                              Rapyd Disburse - Payout Method Type
//      ************************************************************************************************
//      ************************************************************************************************/

    
//     /**
//     * List Payout Method Types
//     * 
//     * GET /payment/payout_methods
//     */
//     static async listPayoutMethodTypes(req, res) {
//         const { ...params } = req.query;

//         // Convierte los parámetros adicionales en una cadena de consulta
//         const searchParams = new URLSearchParams({ ...params }).toString();

//         try {
//             const httpMethod = 'GET';
//             const urlPath = `/v1/payout_methods?${searchParams}`;

//             // Realiza la solicitud con makeRequest
//             const response = await makeRequest(httpMethod, urlPath);

//             // Responde al cliente con la data obtenida
//             return sendResponse(res, 200, false, "List Payout Method Types retrieved successfully", response.body.data, { status: response.body.status });

//         } catch (error) {
//             console.error("Error retrieved List Payout Method Types:", error);
//             return sendResponse(res, error.statusCode || 500, true, "Error retrieved List Payout Method Types", error.message || error.body || "Unknown error");
//         }
//     }


//     /**
//     * Get Payout Required Fields
//     * Retrieve the fields required to use a payout method type.
//     * 
//     * GET /payment/payout_methods/:payout_method_type/required_fields
//     */
//     static async getPayoutRequiredFields(req, res) {
//         const { payout_method_type } = req.params;
//         const { ...params } = req.query;

//         const searchParams = new URLSearchParams({ ...params }).toString();

//         try {
//             const httpMethod = 'GET';
//             const urlPath = `/v1/payout_methods/${payout_method_type}/required_fields?${searchParams}`;

//             // Realiza la solicitud con makeRequest
//             const response = await makeRequest(httpMethod, urlPath);

//             // Responde al cliente con la data obtenida
//             return sendResponse(res, 200, false, "Payout Required Fields retrieved successfully", response, { status: response.body.status });

//         } catch (error) {
//             console.error("Error retrieved Payout Required Fields:", error);
//             return sendResponse(res, error.statusCode || 500, true, "Error retrieved Payout Required Fields", error.message || error.body || "Unknown error");
//         }
//     }



//     /************************************************************************************************
//      ************************************************************************************************
//      *                                            Wallets
//      ************************************************************************************************
//      ************************************************************************************************/

    
//     /**
//     * Create Wallet
//     * 
//     * POST /payment/ewallets
//     */
//     static async createWallet(req, res) {
//         const { userId } = req.user;
//         const { contact, first_name, last_name, type='company', businessId, ...bodyReq } = req.body;

//         try {
//             // Validar que existe la empresa
//             const business = await Business.findByPk(businessId);  
//             if (!business) {
//                 return sendResponse(res, 404, true, "Empresa no encontrada");
//             }
//             if (business.ownerId !== userId) {
//                 return sendResponse(res, 404, true, "Acceso denegado: No eres el propietario de la empresa");
//             }

//             // Crear Wallet en el PSP
//             const httpMethod = 'POST';
//             const urlPath = `/v1/ewallets`;
//             const body = {
//                 first_name: business.name || first_name,
//                 last_name,
//                 type,
//                 contact,
//                 ...bodyReq,
//             };

//             // Realiza la solicitud con makeRequest
//             const response = await makeRequest(httpMethod, urlPath, body);

//             // Agregar id de la wallet a la DB
//             business.PSPWalletId = response.body.data.id;
//             const responseUpdatedBusiness = await business.save();

//             // Responde al cliente con la data obtenida
//             return sendResponse(res, 200, false, "Wallet created successfully", {
//                 ...responseUpdatedBusiness,
//                 psp_wallet: response.body.data,
//             }, { status: response.body.status });

//         } catch (error) {
//             console.error("Error creating wallet:", error);
//             return sendResponse(res, error.statusCode || 500, true, "Error creating wallet", error.message || error.body || "Unknown error");
//         }
//     }

//     /**
//     * Add Contact to Wallet
//     * Add a personal contact to a company wallet or client wallet.
//     * 
//     * POST /payment/ewallets/:wallet/contacts
//     */
//     static async addContactToWallet(req, res) {
//         const { first_name, last_name, date_of_birth, country, address, ...bodyReq } = req.body;

//         try {
//             const httpMethod = 'POST';
//             const urlPath = `/v1/ewallets/:wallet/contacts`;

//             const body = {
//                 first_name,
//                 last_name,
//                 date_of_birth,
//                 country,
//                 address,
//                 ...bodyReq,
//             };

//             // Realiza la solicitud con makeRequest
//             const response = await makeRequest(httpMethod, urlPath, body);

//             // Responde al cliente con la data obtenida
//             return sendResponse(res, 200, false, "Added Contact to Wallet successfully", response.body.data, { status: response.body.status });

//         } catch (error) {
//             console.error("Error adding contact to Wallet:", error);
//             return sendResponse(res, error.statusCode || 500, true, "Error adding contact to Wallet", error.message || error.body || "Unknown error");
//         }
//     }


//     /************************************************************************************************
//      ************************************************************************************************
//      *                              Resource Methods - Localization Methods 
//      ************************************************************************************************
//      ************************************************************************************************/

    
//     /**
//     * List Countries
//     * 
//     * GET /payment/data/countries
//     */
//     static async listCountries(req, res) {
//         const { ...params } = req.query;

//         // Convierte los parámetros adicionales en una cadena de consulta
//         const searchParams = new URLSearchParams({ ...params }).toString();

//         try {
//             const httpMethod = 'GET';
//             const urlPath = `/v1/data/countries?${searchParams}`;

//             // Realiza la solicitud con makeRequest
//             const response = await makeRequest(httpMethod, urlPath);

//             // Responde al cliente con la data obtenida
//             return sendResponse(res, 200, false, "List countries retrieved successfully", response.body.data, { status: response.body.status });

//         } catch (error) {
//             console.error("Error retrieved list countries:", error);
//             return sendResponse(res, error.statusCode || 500, true, "Error retrieved list countries", error.message || error.body || "Unknown error");
//         }
//     }


//     /**
//     * Get FX Rate
//     * Recupere un tipo de cambio para la conversión de divisas en pagos y desembolsos.
//     * 
//     * El tipo de cambio que se muestra refleja el tipo de cambio vigente en ese momento.
//     * El tipo de cambio puede variar según el momento y los detalles de la transacción. 
//     * El tipo de cambio incluye las tarifas de margen de cambio.
//     * 
//     * POST /payment/data/fx_rates
//     */
//     static async getFXRate(req, res) {
//         // const { ...params } = req.query;
//         // const searchParams = new URLSearchParams({ ...params }).toString();

//         try {
//             // const httpMethod = 'GET';
//             // const urlPath = `/v1/fx_rates?${searchParams}`;
            
//             // // Realiza la solicitud con makeRequest
//             // const response = await makeRequest(httpMethod, urlPath);

//             const response = await PaymentController.getFXRateHandleFuntion(req.query)

//             // Responde al cliente con la data obtenida
//             return sendResponse(res, 200, false, "FX rate retrieved successfully", response.body.data, { status: response.body.status });

//         } catch (error) {
//             console.error("Error retrieving FX rate:", error);
//             return sendResponse(res, error.statusCode || 500, true, "Error retrieving FX rate", error.message || error.body || "Unknown error");
//         }
//     }





//     /************************************************************************************************
//      ************************************************************************************************
//      *                                          HANDLE FUNCTIONS
//      ************************************************************************************************
//      ************************************************************************************************/

//     // Función independiente para crear un pago
//     static async createPaymentHandleFuntion(body) {
//         const httpMethod = 'POST';
//         const urlPath = `/v1/payments`;
//         // const body = {
//         //     amount,
//         //     currency,
//         //     capture, // Captura inmediata
//         //     description,
//         //     receipt_email,
//         //     customer,
//         //     ...bodyReq,
//         // };

//         console.log(body)

//         // Realiza la solicitud con makeRequest
//         const response = await makeRequest(httpMethod, urlPath, body);
//         return response;
//     }

//     // Función independiente para obtener los FX Rate
//     static async getFXRateHandleFuntion(query) {
//         const { ...params } = query;
//         const searchParams = new URLSearchParams({ ...params }).toString();
        
//         const httpMethod = 'GET';
//         const urlPath = `/v1/fx_rates?${searchParams}`;
        
//         // Realiza la solicitud con makeRequest
//         const response = await makeRequest(httpMethod, urlPath);

//         console.log(body)

//         return response;
//     }

//     /**
//      * @swagger
//      * /api/v1/payment/payments/{payment}/refund:
//      *   post:
//      *     summary: Refund a payment
//      *     tags: [Payments]
//      *     security:
//      *       - bearerAuth: []
//      *     parameters:
//      *       - in: path
//      *         name: payment
//      *         required: true
//      *         schema:
//      *           type: string
//      *         description: Payment ID to refund
//      *     requestBody:
//      *       required: false
//      *       content:
//      *         application/json:
//      *           schema:
//      *             type: object
//      *             properties:
//      *               amount:
//      *                 type: integer
//      *                 description: Amount to refund (in cents). If not provided, refunds the entire payment.
//      *     responses:
//      *       200:
//      *         description: Payment refunded successfully
//      *       400:
//      *         description: Invalid request
//      *       500:
//      *         description: Server error
//      */
//     static async refundPayment(req, res) {
//         const { payment } = req.params;
//         const { amount } = req.body;

//         try {
//             const httpMethod = 'POST';
//             const urlPath = `/v1/payments/${payment}/refund`;
//             const body = amount ? { amount } : {};
            
//             // Realiza la solicitud con makeRequest
//             const response = await makeRequest(httpMethod, urlPath, body);
            
//             // Responde al cliente con la data obtenida
//             return sendResponse(res, 200, false, "Payment refunded successfully", response.body, { status: response.body.status });
//         } catch (error) {
//             console.error("Error refunding payment:", error);
//             return sendResponse(res, error.statusCode || 500, true, "Error refunding payment", error.message || error.body || "Unknown error");
//         }
//     }

// }

// export class PaymentWebHookController {

//     /**
//      * Funcion para simular el envio del webhook
//      */
//     static async capturePaymentSandBox(req, res) {
//         const { payment } = req.body;

//         try {
//             const httpMethod = 'POST';
//             const urlPath = `/v1/payments/${payment}/capture`;
//             const body = { };
        
//             // Realiza la solicitud con makeRequest
//             const response = await makeRequest(httpMethod, urlPath, body);
        
//             // Responde al cliente con la data obtenida
//             return sendResponse(res, 200, false, "Customer created successfully", response.body, { status: response.body.status });
//         } catch (error) {
//             console.error('Error al procesar el webhook:', error);
//             return sendResponse(res, 500, true, 'Error al procesar el webhook', error.message || 'Unknown error');
//         }
//     }


//     /**
//      * Payment Webhook
//      * Handle payment events from Rapyd (e.g., payment captured, payment completed)
//      * 
//      * POST /payment/webhook
//      */
//     static async paymentWebhook(req, res) {
//         try {
//             const responseSandBoxWebHook = await PaymentWebHookController.capturePaymentSandBox(req, res)
//             if (!responseSandBox || responseSandBox.status !== 200) {
//                 console.error('Error en la simulación de captura:', responseSandBox);
//                 return sendResponse(res, 500, true, 'Error en la simulación de captura');
//             }
            
//             const event = req.body; // Captura el evento del webhook

//             // Procesar el tipo de evento
//             switch (event.type) {
//                 case 'payment.captured':
//                     console.log('Pago capturado:', event.data);
//                     // Aquí puedes agregar lógica para actualizar la base de datos o manejar el evento
//                     break;

//                 case 'payment.completed':
//                     console.log('Pago completado:', event.data);
//                     const invoiceId = event.data.invoice;
//                     if (invoiceId) {
//                         // Lógica para actualizar el estado de la factura en la base de datos
//                         await InvoiceModel.updateStatus(invoiceId, 'paid');
//                         console.log(`Factura ${invoiceId} actualizada a pagada.`);
//                     } else {
//                         console.error('No se encontró ID de la factura en el webhook');
//                     }
//                     break;

//                 default:
//                     console.log(`Evento no manejado: ${event.type}`);
//             }

//             // Responder con éxito a Rapyd
//             return sendResponse(res, 200, false, "Webhook received successfully", { received: true });

//         } catch (error) {
//             console.error('Error al procesar el webhook:', error);
//             return sendResponse(res, 500, true, 'Error al procesar el webhook', error.message || 'Unknown error');
//         }
//     }
// }