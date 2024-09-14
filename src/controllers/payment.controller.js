import {
    body,
    param,
    query,
    validationResult
} from "express-validator";
import {
    gatewayBraintree
} from "../config/braintree.config.js";
import {
    sendResponse
} from "../helpers/utils.js";

import braintree from "braintree";
import {
    User
} from "../models/users.js";
import {
    Profile
} from "../models/profile.js";
import axios from "axios";
import CryptoJS from "crypto-js";
import {
    generateInvoicePrefix,
    makeRequest
} from "../helpers/payment.helper.js";
import { Business } from "../models/business.js";

async function getInfoCustomerId(userId) {
    const profile = await Profile.findOne({ userId: { userId } });
    if (!profile) {
        return sendResponse(res, 401, true, 'Usuario no encontrado');
    }

    return profile?.PSPCustomerId
}

export class PaymentController {


    // ***************************** PAYMENT *****************************

    // /**
    //  * Generar Client Token
    //  */
    // // GET payment/client-token
    // static async generateClientToken(req, res) {
    //     try {
    //         // Generar el client token
    //         const result = await gatewayBraintree.clientToken.generate({});

    //         if (result.success) {
    //             return sendResponse(res, 200, false, 'Client Token generado con éxito', {
    //                 clientToken: result.clientToken
    //             });
    //         } else {
    //             return sendResponse(res, 400, true, 'Error al generar el Client Token', result.message);
    //         }
    //     } catch (err) {
    //         console.error("Error al generar el Client Token:", err);
    //         return sendResponse(res, 500, true, 'Error interno al generar el Client Token');
    //     }
    // }

    // /**
    //  * Generar Nonce del Método de Pago
    //  */
    // // POST payment/generate-payment-method-nonce
    // static async generatePaymentMethodNonce(req, res) {
    //     // Validación de los datos de entrada
    //     await body('paymentMethodToken').notEmpty().withMessage('El campo paymentMethodToken es obligatorio.').run(req);

    //     const errors = validationResult(req);
    //     if (!errors.isEmpty()) {
    //         return sendResponse(res, 400, true, 'Errores de validación', errors.array());
    //     }

    //     try {
    //         const {
    //             paymentMethodToken
    //         } = req.body;

    //         // Crear el nonce del método de pago
    //         gateway.paymentMethodNonce.create(paymentMethodToken, (err, result) => {
    //             if (err) {
    //                 console.error('Error al crear el nonce del método de pago:', err);
    //                 return sendResponse(res, 500, true, 'Error al crear el nonce del método de pago', err.message);
    //             }

    //             // Enviar el nonce al cliente
    //             const nonce = result.paymentMethodNonce.nonce;
    //             return sendResponse(res, 200, false, 'Nonce del método de pago generado con éxito', {
    //                 nonce
    //             });
    //         });
    //     } catch (err) {
    //         console.error('Error interno al crear el nonce del método de pago:', err);
    //         return sendResponse(res, 500, true, 'Error interno al crear el nonce del método de pago');
    //     }
    // }

    // /**
    //  * Realizar un Cobro
    //  */
    // // POST payment/charge
    // static async chargeCustomer(req, res) {
    //     // Validación de los datos de entrada
    //     await body('customerId').notEmpty().withMessage('El campo customerId es obligatorio.').run(req);
    //     await body('paymentMethodToken').notEmpty().withMessage('El campo paymentMethodToken es obligatorio.').run(req);
    //     await body('amount').isFloat({
    //         min: 0.01
    //     }).withMessage('El campo amount debe ser un número positivo.').run(req);
    //     // await body('currency').optional().isIn(['USD', 'EUR', 'GBP']).withMessage('La moneda especificada no es válida.').run(req); // Monedas válidas

    //     const errors = validationResult(req);
    //     if (!errors.isEmpty()) {
    //         return sendResponse(res, 400, true, 'Errores de validación', errors.array());
    //     }

    //     const {
    //         customerId,
    //         paymentMethodToken,
    //         amount,
    //         currency
    //     } = req.body;

    //     try {
    //         const result = await gatewayBraintree.transaction.sale({
    //             amount: amount, // Monto a cobrar
    //             paymentMethodToken: paymentMethodToken, // Token del método de pago
    //             customerId: customerId, // ID del cliente al que se le cargará
    //             // currencyIsoCode: currency, // Moneda en la que se cobrará
    //             options: {
    //                 submitForSettlement: true // Procesar inmediatamente el pago
    //             }
    //         });

    //         if (result.success) {
    //             // const newTransaction = await Transaction.create({
    //             //     userId: req.user.userId,
    //             //     amount: amount,
    //             //     transactionId: result.transaction.id
    //             // });

    //             // return sendResponse(res, 201, false, "Cobro realizado exitosamente", newTransaction);
    //             return sendResponse(res, 200, false, 'Cargo realizado con éxito', result.transaction);
    //         } else {
    //             return sendResponse(res, 400, true, "Error al realizar el cobro", result.message);
    //         }
    //     } catch (error) {
    //         console.error("Error al realizar el cobro:", error);
    //         return sendResponse(res, 500, true, "Error interno al realizar el cobro");
    //     }
    // }


    // // ***************************** CUSTOMER *****************************

    // /**
    //  * Crear Cliente
    //  */
    // // POST payment/customers
    // static async createCustomer(req, res) {
    //     // Validación de los datos de entrada
    //     // await body('firstName').notEmpty().withMessage('El campo firstName es obligatorio.').run(req);
    //     // await body('lastName').notEmpty().withMessage('El campo lastName es obligatorio.').run(req);
    //     // await body('email').isEmail().withMessage('El campo email debe ser una dirección de correo electrónico válida.').run(req);

    //     // const errors = validationResult(req);
    //     // if (!errors.isEmpty()) {
    //     //     return sendResponse(res, 400, true, 'Errores de validación', errors.array());
    //     // }

    //     try {
    //         const {
    //             userId
    //         } = req.user;

    //         // Consulta el usuario y el perfil en la base de datos
    //         const user = await User.findByPk(userId);
    //         if (!user) {
    //             return sendResponse(res, 404, true, 'Usuario no encontrado');
    //         }

    //         const profile = await Profile.findOne({
    //             where: {
    //                 userId: userId
    //             }
    //         });
    //         if (!profile) {
    //             return sendResponse(res, 404, true, 'Perfil no encontrado');
    //         }

    //         const {
    //             email
    //         } = user;
    //         const {
    //             name,
    //             lastname
    //         } = profile;


    //         const result = await gatewayBraintree.customer.create({
    //             firstName: name,
    //             lastName: lastname,
    //             email: email
    //         });

    //         if (result.success) {

    //             // obtener la información del cliente de braintree
    //             const braintreeCustomerId = result.customer.id;

    //             // Actualiza el registro del perfil en la base de datos con el ID de Braintree
    //             profile.braintreeCustomerId = braintreeCustomerId;
    //             await profile.save();

    //             return sendResponse(res, 200, false, 'Cliente creado con éxito', result.customer);
    //         } else {
    //             return sendResponse(res, 400, true, 'Error al crear el cliente', result.customer);
    //         }
    //     } catch (err) {
    //         console.error("Error al crear el cliente:", err);
    //         return sendResponse(res, 500, true, 'Error interno al crear el cliente');
    //     }
    // }

    // /**
    //  * Obtener Información de un Cliente Basado en el Usuario Autenticado
    //  * 
    //  * GET payment/customers/me
    //  */
    // static async getCustomer(req, res) {
    //     try {
    //         // Obtener el ID del usuario autenticado
    //         const {
    //             userId
    //         } = req.user;

    //         // Consultar en la base de datos para obtener el customerId asociado
    //         const profile = await Profile.findOne({
    //             where: {
    //                 userId: userId
    //             }
    //         });

    //         if (!profile || !profile.braintreeCustomerId) {
    //             return sendResponse(res, 404, true, 'Cliente no encontrado en la base de datos');
    //         }

    //         // Obtener la información del cliente desde Braintree usando el customerId
    //         const result = await gatewayBraintree.customer.find(profile.braintreeCustomerId);

    //         if (result) {
    //             return sendResponse(res, 200, false, 'Información del cliente obtenida con éxito', result);
    //         } else {
    //             return sendResponse(res, 404, true, 'Cliente no encontrado en Braintree');
    //         }
    //     } catch (err) {
    //         console.error("Error al obtener la información del cliente:", err);
    //         return sendResponse(res, 500, true, 'Error interno al obtener la información del cliente');
    //     }
    // }

    // /**
    //  * Actualizar Cliente
    //  */
    // // PUT payment/customers
    // static async updateCustomer(req, res) {
    //     try {
    //         const {
    //             userId
    //         } = req.user;

    //         // Consulta el usuario y el perfil en la base de datos
    //         const user = await User.findByPk(userId);
    //         if (!user) {
    //             return sendResponse(res, 404, true, 'Usuario no encontrado');
    //         }

    //         const profile = await Profile.findOne({
    //             where: {
    //                 userId: userId
    //             }
    //         });
    //         if (!profile) {
    //             return sendResponse(res, 404, true, 'Perfil no encontrado');
    //         }

    //         const {
    //             email
    //         } = user;
    //         const {
    //             name,
    //             lastname
    //         } = profile;

    //         const braintreeCustomerId = profile.braintreeCustomerId;

    //         // Actualizar el cliente en Braintree
    //         const result = await gatewayBraintree.customer.update(braintreeCustomerId, {
    //             firstName: name,
    //             lastName: lastname,
    //             email: email,
    //         });

    //         if (result.success) {
    //             return sendResponse(res, 200, false, 'Cliente actualizado con éxito', result.customer);
    //         } else {
    //             return sendResponse(res, 400, true, 'Error al actualizar el cliente', result.message);
    //         }
    //     } catch (err) {
    //         res.status(500).send(err);
    //     }
    // }

    // /**
    //  * Obtener Información de un Cliente
    //  */
    // // GET payment/customers/:customerId
    // static async getCustomerByIdBraintree(req, res) {
    //     // Validación del parámetro customerId
    //     await param('customerId').notEmpty().withMessage('El campo customerId es obligatorio.').run(req);

    //     const errors = validationResult(req);
    //     if (!errors.isEmpty()) {
    //         return sendResponse(res, 400, true, 'Errores de validación', errors.array());
    //     }

    //     const {
    //         customerId
    //     } = req.params;

    //     try {
    //         const result = await gatewayBraintree.customer.find(customerId);

    //         if (result) {
    //             return sendResponse(res, 200, false, 'Información del cliente obtenida con éxito', result);
    //         } else {
    //             return sendResponse(res, 404, true, 'Cliente no encontrado');
    //         }
    //     } catch (err) {
    //         console.error("Error al obtener la información del cliente:", err);
    //         return sendResponse(res, 500, true, 'Error interno al obtener la información del cliente');
    //     }
    // }


    // // ***************************** PAYMENT METHOD *****************************

    // /**
    //  * Agregar un Método de Pago a un Cliente
    //  */
    // // POST payment/customers/payment-methods
    // static async addPaymentMethod(req, res) {
    //     // Validación de los datos de entrada
    //     // await param('customerId').notEmpty().withMessage('El campo customerId es obligatorio.').run(req);
    //     await body('paymentMethodNonce').notEmpty().withMessage('El campo paymentMethodNonce es obligatorio.').run(req);
    //     await body('makeDefault')
    //         .isBoolean().withMessage('El campo makeDefault debe ser un valor booleano.')
    //         .optional() // Este campo es opcional, no requiere validación si no está presente
    //         .toBoolean() // Convierte el valor a booleano
    //         .run(req);

    //     const errors = validationResult(req);
    //     if (!errors.isEmpty()) {
    //         return sendResponse(res, 400, true, 'Errores de validación', errors.array());
    //     }

    //     // Obtener el ID del usuario autenticado
    //     const {
    //         userId
    //     } = req.user;
    //     const {
    //         paymentMethodNonce,
    //         makeDefault
    //     } = req.body;
    //     // const { customerId } = req.params;

    //     try {
    //         // Consultar en la base de datos para obtener el customerId asociado
    //         const profile = await Profile.findOne({
    //             where: {
    //                 userId: userId
    //             }
    //         });

    //         if (!profile || !profile.braintreeCustomerId) {
    //             return sendResponse(res, 404, true, 'Cliente no encontrado en la base de datos');
    //         }

    //         const result = await gatewayBraintree.paymentMethod.create({
    //             customerId: profile.braintreeCustomerId, // ID del cliente al que se le agregará el método de pago
    //             paymentMethodNonce: paymentMethodNonce,
    //             options: {
    //                 verifyCard: true,
    //                 makeDefault: makeDefault || false,
    //             }
    //         });

    //         if (result.success) {
    //             return sendResponse(res, 200, false, 'Método de pago agregado con éxito', result.paymentMethod);
    //         } else {
    //             return sendResponse(res, 400, true, 'Error al agregar el método de pago', result.message);
    //         }
    //     } catch (err) {
    //         console.error("Error al agregar el método de pago:", err);
    //         return sendResponse(res, 500, true, 'Error interno al agregar el método de pago');
    //     }
    // }

    // /**
    //  * Consultar Método de Pago Predeterminado de un Cliente
    //  * 
    //  * GET payment/customers/payment-methods/default
    //  */
    // static async getDefaultPaymentMethod(req, res) {
    //     try {
    //         // Obtener el ID del usuario autenticado
    //         const {
    //             userId
    //         } = req.user;

    //         // Consultar en la base de datos para obtener el customerId asociado
    //         const profile = await Profile.findOne({
    //             where: {
    //                 userId: userId
    //             }
    //         });

    //         if (!profile || !profile.braintreeCustomerId) {
    //             return sendResponse(res, 404, true, 'Cliente no encontrado en la base de datos');
    //         }

    //         // Obtener todos los métodos de pago del cliente
    //         const result = await gatewayBraintree.customer.find(profile.braintreeCustomerId);

    //         if (result) {
    //             // Buscar el método de pago predeterminado
    //             const defaultPaymentMethod = result.paymentMethods.find(method => method.default);

    //             if (defaultPaymentMethod) {
    //                 return sendResponse(res, 200, false, 'Método de pago predeterminado obtenido con éxito', defaultPaymentMethod);
    //             } else {
    //                 return sendResponse(res, 404, true, 'Método de pago predeterminado no encontrado');
    //             }
    //         } else {
    //             return sendResponse(res, 400, true, 'Error al obtener los métodos de pago del cliente', result.message);
    //         }
    //     } catch (err) {
    //         console.error("Error al obtener el método de pago predeterminado:", err);
    //         return sendResponse(res, 500, true, 'Error interno al obtener el método de pago predeterminado');
    //     }
    // }

    // /**
    //  * Eliminar Método de Pago
    //  * 
    //  * DELETE payment/customers/payment-methods/:paymentMethodToken
    //  */
    // static async deletePaymentMethod(req, res) {
    //     try {
    //         const {
    //             userId
    //         } = req.user;
    //         const {
    //             paymentMethodToken
    //         } = req.params;

    //         if (!paymentMethodToken) {
    //             return sendResponse(res, 400, true, 'El campo paymentMethodToken es obligatorio.');
    //         }

    //         // Consultar en la base de datos para obtener el braintreeCustomerId asociado
    //         const profile = await Profile.findOne({
    //             where: {
    //                 userId: userId
    //             }
    //         });

    //         if (!profile || !profile.braintreeCustomerId) {
    //             return sendResponse(res, 404, true, 'Cliente no encontrado en la base de datos');
    //         }

    //         const braintreeCustomerId = profile.braintreeCustomerId;

    //         // Buscar los métodos de pago del cliente
    //         const paymentMethodsResult = await gatewayBraintree.paymentMethod.find(paymentMethodToken);

    //         if (!paymentMethodsResult || paymentMethodsResult.customerId != braintreeCustomerId) {
    //             return sendResponse(res, 404, true, 'Método de pago no encontrado.');
    //         }

    //         await gatewayBraintree.paymentMethod.delete(paymentMethodToken);

    //         return sendResponse(res, 200, false, 'Método de pago eliminado con éxito');
    //     } catch (err) {
    //         console.error("Error al eliminar el método de pago:", err);
    //         return sendResponse(res, 500, true, 'Error interno al eliminar el método de pago');
    //     }
    // }

    // // ***************************** TRANSACTIONS *****************************

    // /**
    //  * Obtener Todas las Transacciones de "Sale" de un Cliente
    //  * 
    //  * GET payment/customers/transactions
    //  */
    // static async getCustomerTransactions(req, res) {

    //     try {
    //         // Obtener el ID del usuario autenticado
    //         const {
    //             userId
    //         } = req.user;

    //         // Consultar en la base de datos para obtener el customerId asociado
    //         const profile = await Profile.findOne({
    //             where: {
    //                 userId: userId
    //             }
    //         });

    //         if (!profile || !profile.braintreeCustomerId) {
    //             return sendResponse(res, 404, true, 'Cliente no encontrado en la base de datos');
    //         }

    //         const braintreeCustomerId = profile.braintreeCustomerId;

    //         // Buscar transacciones asociadas al cliente
    //         const searchResults = gatewayBraintree.transaction.search((search) => {
    //             search.customerId().is(braintreeCustomerId);
    //             search.type().is("sale");
    //         });

    //         const transactions = [];
    //         searchResults.on('data', (transaction) => {
    //             transactions.push(transaction);
    //         });

    //         searchResults.on('end', () => {
    //             return sendResponse(res, 200, false, 'Transacciones obtenidas con éxito', transactions);
    //         });

    //         searchResults.on('error', (err) => {
    //             console.error("Error al obtener las transacciones del cliente:", err);
    //             return sendResponse(res, 500, true, 'Error interno al obtener las transacciones del cliente');
    //         });
    //     } catch (err) {
    //         console.error("Error al obtener las transacciones del cliente:", err);
    //         return sendResponse(res, 500, true, 'Error interno al obtener las transacciones del cliente');
    //     }
    // }

    // /**
    //  * Obtener Todas las Transacciones de "Sale" de un Cliente
    //  */
    // // GET payment/customers/:customerId/transactions
    // static async getCustomerTransactionsByIdBraintree(req, res) {
    //     // Validación del parámetro customerId
    //     await param('customerId').notEmpty().withMessage('El campo customerId es obligatorio.').run(req);

    //     const errors = validationResult(req);
    //     if (!errors.isEmpty()) {
    //         return sendResponse(res, 400, true, 'Errores de validación', errors.array());
    //     }

    //     const {
    //         customerId
    //     } = req.params;

    //     try {
    //         // Buscar transacciones asociadas al cliente
    //         const searchResults = await gatewayBraintree.transaction.search((search) => {
    //             search.customerId().is(customerId);
    //             search.type().is("sale");
    //         });

    //         const transactions = [];
    //         searchResults.on('data', (transaction) => {
    //             transactions.push(transaction);
    //         });

    //         searchResults.on('end', () => {
    //             return sendResponse(res, 200, false, 'Transacciones obtenidas con éxito', transactions);
    //         });

    //         searchResults.on('error', (err) => {
    //             console.error("Error al obtener las transacciones del cliente:", err);
    //             return sendResponse(res, 500, true, 'Error interno al obtener las transacciones del cliente');
    //         });
    //     } catch (err) {
    //         console.error("Error al obtener las transacciones del cliente:", err);
    //         return sendResponse(res, 500, true, 'Error interno al obtener las transacciones del cliente');
    //     }
    // }

    // // ***************************** BUSINESS *****************************

    // /**
    //  * Registro de Cuenta Bancaria para Empresas
    //  *  Endpoint para que las empresas puedan registrar su cuenta bancaria donde recibirán los pagos.
    //  */
    // // POST payment/business/bank-account
    // static async registerBusinessBankAccount(req, res) {
    //     await body('bankName').notEmpty().withMessage('El nombre del banco es obligatorio').run(req);
    //     await body('accountNumber').notEmpty().withMessage('El número de cuenta es obligatorio').run(req);
    //     // await body('accountHolderName').notEmpty().withMessage('El nombre del titular es obligatorio').run(req);
    //     await body('routingNumber').notEmpty().withMessage('El número de ruta es obligatorio').run(req);

    //     const errors = validationResult(req);
    //     if (!errors.isEmpty()) {
    //         return sendResponse(res, 400, true, 'Errores de validación', errors.array());
    //     }

    //     const {
    //         bankName,
    //         accountNumber,
    //         accountHolderName,
    //         routingNumber,
    //         business,
    //         funding
    //     } = req.body;

    //     try {
    //         // Crear la cuenta de comerciante en Braintree
    //         const merchantAccountParams = {
    //             individual: {
    //                 firstName: accountHolderName || 'Nombre del Titular',
    //                 lastName: 'Apellido',
    //                 email: 'contacto@example.com',
    //                 phone: '5555555555',
    //                 dateOfBirth: '1980-01-01',
    //                 ssn: '12345678',
    //                 address: {
    //                     streetAddress: 'Dirección',
    //                     locality: 'Ciudad',
    //                     region: 'Región',
    //                     postalCode: 'Código Postal'
    //                 }
    //             },
    //             business: {
    //                 legalName: business.legalName || 'Nombre Legal de la Empresa',
    //                 dbaName: business.dbaName || 'Nombre Comercial de la Empresa',
    //                 taxId: business.taxId || 'RUT o Identificación Fiscal',
    //                 address: {
    //                     streetAddress: business.address.streetAddress || 'Dirección de la Empresa',
    //                     locality: business.address.locality || 'Ciudad de la Empresa',
    //                     region: business.address.region || 'Región de la Empresa',
    //                     postalCode: business.address.postalCode || 'Código Postal de la Empresa'
    //                 }
    //             },
    //             funding: {
    //                 descriptor: bankName,
    //                 destination: braintree.MerchantAccount.FundingDestination.Bank,
    //                 email: funding.email || 'funding@example.com',
    //                 mobilePhone: funding.mobilePhone || '5555555555',
    //                 accountNumber: accountNumber,
    //                 routingNumber: routingNumber,
    //             },
    //             tosAccepted: true,
    //             masterMerchantAccountId: 'Sethor_LT',
    //             id: 'sethor_new',
    //         };

    //         gatewayBraintree.merchantAccount.create(merchantAccountParams, async (err, result) => {
    //             if (result.success) {
    //                 return sendResponse(res, 201, false, "Cuenta bancaria registrada correctamente", {});
    //             } else {
    //                 console.error('Error al crear la cuenta del comerciante:', err);
    //                 return sendResponse(res, 400, true, 'Error al crear la cuenta del comerciante', result);
    //             }

    //         });

    //     } catch (error) {
    //         console.error("Error al registrar cuenta bancaria:", error);
    //         return sendResponse(res, 500, true, "Error al registrar cuenta bancaria");
    //     }
    // }





























    /************************************************************************************************
     ************************************************************************************************
     *                                          CUSTOMER
     ************************************************************************************************
     ************************************************************************************************/


    /**
     * Create Customer
     * Create a customer profile to save the payment methods a customer can use.
     * 
     * POST /payment/customers
     */
    static async createCustomer(req, res) {
        // Validaciones
        await body('invoice_prefix').optional().isString().withMessage('Invoice prefix must be a string').run(req);
        await body('name').isString().notEmpty().withMessage('Name is required').run(req);
        await body('email').isEmail().withMessage('Valid email is required').run(req);

        // Verifica los errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendResponse(res, 400, true, 'Errores de validación', errors.array());
        }

        // Extrae los datos de la solicitud
        const { email, invoice_prefix, name, ...bodyReq } = req.body;

        try {
            const httpMethod = 'POST';
            const urlPath = '/v1/customers';
            const body = {
                email,
                invoice_prefix: invoice_prefix || generateInvoicePrefix(name),
                name,
                metadata: {
                    merchant_defined: true
                },
                ...bodyReq,
            };

            // Realiza la solicitud con makeRequest
            const response = await makeRequest(httpMethod, urlPath, body);

            // Responde al cliente con la data obtenida
            return sendResponse(res, 200, false, "Customer created successfully", response.body, { status: response.body.status });

        } catch (error) {
            console.error("Error al crear el customer:", error);
            return sendResponse(res, error.statusCode || 500, true, "Error al crear el customer", error.message || error.body || "Unknown error");
        }
    }

    /**
     * Update Customer
     * Change one or more fields in a customer profile.
     * To clear a field, set it to an empty string.
     * 
     * POST /payment/customers/:customer
     */
    static async updateCustomer(req, res) {
        // Validaciones
        await body('default_payment_method').optional().isString().withMessage('The payment method that is used when the transaction does not specify a payment method. String starting with card_ or other_.').run(req);
        await body('name').optional().isString().withMessage('Name is required').run(req);
        await body('email').optional().isEmail().withMessage('Valid email is required').run(req);

        // Verifica los errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendResponse(res, 400, true, 'Errores de validación', errors.array());
        }

        // Extrae los datos de la solicitud
        const { customer } = req.params;
        const { email, name, default_payment_method, ...bodyReq } = req.body;

        try {
            const httpMethod = 'POST';
            const urlPath = `/v1/customers/${customer}`;
            const body = {
                email,
                default_payment_method,
                name,
                ...bodyReq,
            };

            // Realiza la solicitud con makeRequest
            const response = await makeRequest(httpMethod, urlPath, body);

            // Responde al cliente con la data obtenida
            return sendResponse(res, 200, false, "Customer updated successfully", response.body, { status: response.body.status });

        } catch (error) {
            console.error("Error al actualizar el customer:", error);
            return sendResponse(res, error.statusCode || 500, true, "Error al actualizar el customer", error.message || error.body || "Unknown error");
        }
    }

    /**
     * Retrieve Customer
     * Change one or more fields in a customer profile.
     * To clear a field, set it to an empty string.
     * 
     * POST /payment/customers/:customer
     */
    static async retrieveCustomer(req, res) {
        const { userId } = req.user;
        const { customer } = req.params;

        try {
            const PSPCustomerId = await getInfoCustomerId(userId);

            const httpMethod = 'GET';
            // const urlPath = `/v1/customers/${customer}`;
            const urlPath = `/v1/customers/${PSPCustomerId}`;

            // Realiza la solicitud con makeRequest
            const response = await makeRequest(httpMethod, urlPath);

            // Responde al cliente con la data obtenida
            return sendResponse(res, 200, false, "Customer retrieved successfully", response.body.data, { status: response.body.status });

        } catch (error) {
            console.error("Error al recuperar el customer:", error);
            return sendResponse(res, error.statusCode || 500, true, "Error al recuperar el customer", error.message || error.body || "Unknown error");
        }
    }



    /************************************************************************************************
     ************************************************************************************************
     *                                    CUSTOMER PAYMENT METHOD
     ************************************************************************************************
     ************************************************************************************************/


    /**
     * Create Card Token
     * Create a hosted page for a customer to save card details and manage cards.
     * 
     * POST /payment/hosted/collect/card
     */
    static async createCardToken(req, res) {
        const { userId } = req.user;
        const { customer, country = 'gb', language = 'es', ...bodyReq } = req.body;

        try {
            // const profile = await Profile.findOne({ userId: { userId } });
            // if (!profile) {
            //     return sendResponse(res, 401, true, 'Usuario no encontrado');
            // }

            // const PSPCustomerId = profile.PSPCustomerId
            const PSPCustomerId = await getInfoCustomerId(userId);

            const httpMethod = 'POST';
            const urlPath = '/v1/hosted/collect/card';
            const body = {
                country: country,
                customer: PSPCustomerId,
                language: language,
                ...bodyReq
            };

            // Realiza la solicitud con makeRequest
            const response = await makeRequest(httpMethod, urlPath, body);

            // Responde al cliente con la data obtenida
            return sendResponse(res, 200, false, "Url para crear el token creado exitosamente", response.body.data, { status: response.body.status });

        } catch (error) {
            console.error("Error al crear el token de la tarjeta:", error);
            return sendResponse(res, error.statusCode || 500, true, "Error al crear el token de la tarjeta", error.body || error);
        }
    }
    // static async createCardToken(req, res) {
    //     // Validaciones
    //     await body('customer').isString().notEmpty().withMessage('Customer ID is required').run(req);
    //     await body('country').optional().isISO31661Alpha2().withMessage('Invalid country code. The two-letter ISO 3166-1 ALPHA-2 code for the country.').run(req);

    //     // Verifica los errores de validación
    //     const errors = validationResult(req);
    //     if (!errors.isEmpty()) {
    //         return sendResponse(res, 400, true, 'Errores de validación', errors.array());
    //     }

    //     const { customer, country = 'gb', language = 'es', ...bodyReq } = req.body;

    //     try {

    //         const httpMethod = 'POST';
    //         const urlPath = '/v1/hosted/collect/card';
    //         const body = {
    //             country: country,
    //             customer: customer,
    //             language: language,
    //             ...bodyReq
    //         };

    //         // Realiza la solicitud con makeRequest
    //         const response = await makeRequest(httpMethod, urlPath, body);

    //         // Responde al cliente con la data obtenida
    //         return sendResponse(res, 200, false, "Url para crear el token creado exitosamente", response.body.data, { status: response.body.status });

    //     } catch (error) {
    //         console.error("Error al crear el token de la tarjeta:", error);
    //         return sendResponse(res, error.statusCode || 500, true, "Error al crear el token de la tarjeta", error.body || error);
    //     }
    // }


    /**
     * Add Payment Method to Customer
     * Add a payment method to a customer profile (card on file).
     * 
     * POST /payment/customers/:customer/payment_methods
     */
    static async addPaymentMethodOfCustomer(req, res) {
        // Validaciones
        await body('type').optional().isString().withMessage('Payment method type must be a string').run(req);
        await body('token').optional().isString().withMessage('Token must be a string').run(req);

        // Validación personalizada para 'type' o 'token'
        await body().custom((value, { req }) => {
            const { type, token } = req.body;
            if ((type && token) || (!type && !token)) {
                throw new Error("You must set only one of the following parameters: 'type' or 'token'.");
            }
            return true;
        }).run(req);

        // Verifica los errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendResponse(res, 400, true, 'Errores de validación', errors.array());
        }

        const { customer } = req.params;
        const { ...bodyReq } = req.body;

        try {
            const httpMethod = 'POST';
            const urlPath = `/v1/customers/${customer}/payment_methods`;
            const body = {
                ...bodyReq,
                fields: {
                    language: 'es',
                }
            };

            // Realiza la solicitud con makeRequest
            const response = await makeRequest(httpMethod, urlPath, body);

            // Responde al cliente con la data obtenida
            return sendResponse(res, 200, false, "Payment method added successfully", response.body.data, { status: response.body.status });

        } catch (error) {
            console.error("Error al agregar el método de pago:", error);
            return sendResponse(res, error.statusCode || 500, true, "Error al agregar el método de pago", error.message || error.body || "Unknown error");
        }
    }

    /**
     * List Payment Methods of Customer
     * List all the payment methods of a customer.
     * 
     * GET /payment/customers/PSPCustomerId/payment_methods
     */
    static async listPaymentMethodsOfCustomer(req, res) {
        const { userId } = req.user;
        const { customer } = req.params;
        const { ...bodyReq } = req.body;

        try {
            const PSPCustomerId = await getInfoCustomerId(userId);

            const httpMethod = 'GET';
            // const urlPath = `/v1/customers/${customer}/payment_methods`;
            const urlPath = `/v1/customers/${PSPCustomerId}/payment_methods`;
            const body = {
                ...bodyReq,
            };

            // Realiza la solicitud con makeRequest
            const response = await makeRequest(httpMethod, urlPath, body);

            // Responde al cliente con la data obtenida
            return sendResponse(res, 200, false, "Payment method get successfully", response.body.data, { status: response.body.status });

        } catch (error) {
            console.error("Error al obtener métodos de pago:", error);
            return sendResponse(res, error.statusCode || 500, true, "Error al obtener métodos de pago", error.message || error.body || "Unknown error");
        }
    }
    // static async listPaymentMethodsOfCustomer(req, res) {
    //     const { customer } = req.params;
    //     const { ...bodyReq } = req.body;

    //     try {
    //         const httpMethod = 'GET';
    //         const urlPath = `/v1/customers/${customer}/payment_methods`;
    //         const body = {
    //             ...bodyReq,
    //         };

    //         // Realiza la solicitud con makeRequest
    //         const response = await makeRequest(httpMethod, urlPath, body);

    //         // Responde al cliente con la data obtenida
    //         return sendResponse(res, 200, false, "Payment method get successfully", response.body.data, { status: response.body.status });

    //     } catch (error) {
    //         console.error("Error al obtener métodos de pago:", error);
    //         return sendResponse(res, error.statusCode || 500, true, "Error al obtener métodos de pago", error.message || error.body || "Unknown error");
    //     }
    // }

    /**
     * Delete Payment Method
     * Delete a payment method from a customer profile.
     * 
     * DELETE /payment/customers/:customer/payment_methods/:payment_method
     */
    static async deletePaymentMethod(req, res) {
        const { userId } = req.user;
        const { customer, payment_method } = req.params;

        try {
            const PSPCustomerId = await getInfoCustomerId(userId);

            const httpMethod = 'DELETE';
            // const urlPath = `/v1/customers/${customer}/payment_methods/${payment_method}`;
            const urlPath = `/v1/customers/${PSPCustomerId}/payment_methods/${payment_method}`;
            
            // Realiza la solicitud con makeRequest
            const response = await makeRequest(httpMethod, urlPath);

            // Responde al cliente con la data obtenida
            return sendResponse(res, 200, false, "Payment method deleted successfully", response.body.data, { status: response.body.status });

        } catch (error) {
            console.error("Error al eliminar el método pago:", error);
            return sendResponse(res, error.statusCode || 500, true, "Error al eliminar el método de pago", error.message || error.body || "Unknown error");
        }
    }
    // static async deletePaymentMethod(req, res) {
    //     const { customer, payment_method } = req.params;

    //     try {
    //         const httpMethod = 'DELETE';
    //         const urlPath = `/v1/customers/${customer}/payment_methods/${payment_method}`;

    //         // Realiza la solicitud con makeRequest
    //         const response = await makeRequest(httpMethod, urlPath);

    //         // Responde al cliente con la data obtenida
    //         return sendResponse(res, 200, false, "Payment method deleted successfully", response.body.data, { status: response.body.status });

    //     } catch (error) {
    //         console.error("Error al eliminar el método pago:", error);
    //         return sendResponse(res, error.statusCode || 500, true, "Error al eliminar el método de pago", error.message || error.body || "Unknown error");
    //     }
    // }



    /************************************************************************************************
     ************************************************************************************************
     *                                          PAYMENT
     ************************************************************************************************
     ************************************************************************************************/


     // Función independiente para crear un pago
    static async createPaymentHandleFuntion(body) {
        const httpMethod = 'POST';
        const urlPath = `/v1/payments`;
        // const body = {
        //     amount,
        //     currency,
        //     capture, // Captura inmediata
        //     description,
        //     receipt_email,
        //     customer,
        //     ...bodyReq,
        // };

        console.log(body)

        // Realiza la solicitud con makeRequest
        const response = await makeRequest(httpMethod, urlPath, body);
        return response;
    }

    /**
     * Create Payment
     * 
     * POST /payment/payments
     */
    static async createPayment(req, res) {
        // Validaciones
        await body('amount').isFloat({ min: 0 }).notEmpty().withMessage('Amount must be a positive number').run(req);
        await body('currency').isString().isLength({ min: 3, max: 3 }).withMessage('Currency must be a three-letter ISO 4217 code').run(req);
        await body('description').isString().notEmpty().withMessage('Payment method type must be a string').run(req);

        // Verifica los errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendResponse(res, 400, true, 'Errores de validación', errors.array());
        }

        const {
            amount,
            currency,
            capture = true,
            description = '',
            receipt_email = '',
            customer,
            ...bodyReq
        } = req.body;

        try {
            const httpMethod = 'POST';
            const urlPath = `/v1/payments`;
            const body = {
                amount,
                currency,
                capture, // Captura inmediata
                description,
                receipt_email,
                customer,
                ...bodyReq,
            };
            console.log(body)

            // Llama a la función independiente para crear el pago
            const paymentResponse = await PaymentController.createPaymentHandleFuntion(body);


            // // Realiza la solicitud con makeRequest
            // const response = await makeRequest(httpMethod, urlPath, body);

            // Responde al cliente con la data obtenida
            return sendResponse(res, 200, false, "Payment created successfully", paymentResponse.body.data, { status: paymentResponse.body.status });

        } catch (error) {
            console.error("Error creating payment:", error);
            return sendResponse(res, error.statusCode || 500, true, "Error creating payment", error.message || error.body || "Unknown error");
        }
    }


    /**
     * Retrieve Payment
     * 
     * GET /payment/payments/:payment
     */
    static async retrievePayment(req, res) {
        const { payment } = req.params;

        try {
            const httpMethod = 'GET';
            const urlPath = `/v1/payments/${payment}`;

            // Realiza la solicitud con makeRequest
            const response = await makeRequest(httpMethod, urlPath);

            // Responde al cliente con la data obtenida
            return sendResponse(res, 200, false, "Payment retrieved successfully", response.body.data, { status: response.body.status });

        } catch (error) {
            console.error("Error retrieved payment:", error);
            return sendResponse(res, error.statusCode || 500, true, "Error retrieved payment", error.message || error.body || "Unknown error");
        }
    }

    
    /**
     * List Payments
     * 
     * GET /payment/payments
     */
    static async listPayments(req, res) {
        await query('customer').notEmpty().withMessage('The customer query parameter is required to filter the list for payments.').run(req);

        // Verifica los errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendResponse(res, 400, true, 'Validation errors', errors.array());
        }

        const { ...params } = req.query;

        // Convierte los parámetros adicionales en una cadena de consulta
        const searchParams = new URLSearchParams({ ...params }).toString();

        try {
            const httpMethod = 'GET';
            const urlPath = `/v1/payments?${searchParams}`;

            // Realiza la solicitud con makeRequest
            const response = await makeRequest(httpMethod, urlPath);

            // Responde al cliente con la data obtenida
            return sendResponse(res, 200, false, "List Payments retrieved successfully", response.body.data, { status: response.body.status });

        } catch (error) {
            console.error("Error retrieved list payments:", error);
            return sendResponse(res, error.statusCode || 500, true, "Error retrieved list payments", error.message || error.body || "Unknown error");
        }
    }



    /************************************************************************************************
     ************************************************************************************************
     *                                          PAYOUT
     ************************************************************************************************
     ************************************************************************************************/


    /**
     * Create Payout
     * Create a payout (disbursement).
     * 
     * POST /payment/payouts
     */
    static async createPayout(req, res) {

        const { ...bodyReq } = req.body;

        try {
            const httpMethod = 'POST';
            const urlPath = '/v1/payouts';
            const body = {
                // ewallet: 'ewallet_090e1ef18c3aa754fd43cce9ee454858',
                // merchant_reference_id: 'GHY-0YU-HUJ-POI',
                // metadata: {
                //     merchant_defined: true
                // },
                ...bodyReq,
            };

            // Realiza la solicitud con makeRequest
            const response = await makeRequest(httpMethod, urlPath, body);

            // Responde al cliente con la data obtenida
            return sendResponse(res, 200, false, "Payout created successfully", response.body.data, { status: response.body.status });

        } catch (error) {
            console.error("Error creating payout:", error);
            return sendResponse(res, error.statusCode || 500, true, "Error creating payout", error.message || error.body || "Unknown error");
        }

    }

    /**
     * Confirm Payout with FX
     * Confirm the exchange rate of a payout that involves foreign exchange.
     * 
     * POST /payment/payouts/confirm/:payout
     */
    static async confirmPayoutWithFX(req, res) {
        const { payout } = req.params;

        try {
            const httpMethod = 'POST';
            const urlPath = `/v1/payouts/confirm/${payout}`;
            
            // Realiza la solicitud con makeRequest
            const response = await makeRequest(httpMethod, urlPath);

            // Responde al cliente con la data obtenida
            return sendResponse(res, 200, false, "Confirm Payout with FX successfully", response.body.data, { status: response.body.status });

        } catch (error) {
            console.error("Error Confirming Payout with FX:", error);
            return sendResponse(res, error.statusCode || 500, true, "Error Confirming Payout with FX", error.message || error.body || "Unknown error");
        }

    }











    /**
     * Crear un pyament
     */
    // POST business/products/:businessId/branch/:branchId
    static async beneficiary(req, res) {

        try {
            const httpMethod = 'POST';
            const urlPath = '/v1/payouts/beneficiary';
            const body = {
                category: "bank",
                company_name: "All Star Limousine",
                country: "US",
                currency: "USD",
                entity_type: "company",
                identification_type: "company_registered_number",
                identification_value: "9876543210",
                merchant_reference_id: "AllStarLimo", // Fields from 'beneficiary_required_fields' in the response to 'Get Payout Method Type Required Fields'
                account_number: "0987654321",
                aba: "987654321",

                address: '456 Second Street',
                email: 'janedoe@rapyd.net',
                city: 'Anytown',
                postcode: '10101',
                bank_name: 'US General Bank',
                state: 'NY',
                identification_type: 'SSC',
                identification_value: '123456789',
                bic_swift: 'BUINBGSF',
                ach_code: '123456789'
            };

            // Realiza la solicitud con makeRequest
            const response = await makeRequest(httpMethod, urlPath, body);

            // Responde al cliente con la data obtenida
            res.json(response.body);

        } catch (error) {
            console.error('Error:', error.response ? error.response.body : error.message);
            res.status(error.response ? error.response.statusCode : 500).json({
                error: error
            });
        }

    }


    /************************************************************************************************
     ************************************************************************************************
     *                              Resource Methods - Localization Methods 
     ************************************************************************************************
     ************************************************************************************************/

    
    /**
    * List Countries
    * 
    * GET /payment/data/countries
    */
    static async listCountries(req, res) {
        const { ...params } = req.query;

        // Convierte los parámetros adicionales en una cadena de consulta
        const searchParams = new URLSearchParams({ ...params }).toString();

        try {
            const httpMethod = 'GET';
            const urlPath = `/v1/data/countries?${searchParams}`;

            // Realiza la solicitud con makeRequest
            const response = await makeRequest(httpMethod, urlPath);

            // Responde al cliente con la data obtenida
            return sendResponse(res, 200, false, "List countries retrieved successfully", response.body.data, { status: response.body.status });

        } catch (error) {
            console.error("Error retrieved list countries:", error);
            return sendResponse(res, error.statusCode || 500, true, "Error retrieved list countries", error.message || error.body || "Unknown error");
        }
    }



    /************************************************************************************************
     ************************************************************************************************
     *                              Rapyd Disburse - Payout Method Type
     ************************************************************************************************
     ************************************************************************************************/

    
    /**
    * List Payout Method Types
    * 
    * GET /payment/payout_methods
    */
    static async listPayoutMethodTypes(req, res) {
        const { ...params } = req.query;

        // Convierte los parámetros adicionales en una cadena de consulta
        const searchParams = new URLSearchParams({ ...params }).toString();

        try {
            const httpMethod = 'GET';
            const urlPath = `/v1/payout_methods?${searchParams}`;

            // Realiza la solicitud con makeRequest
            const response = await makeRequest(httpMethod, urlPath);

            // Responde al cliente con la data obtenida
            return sendResponse(res, 200, false, "List Payout Method Types retrieved successfully", response.body.data, { status: response.body.status });

        } catch (error) {
            console.error("Error retrieved List Payout Method Types:", error);
            return sendResponse(res, error.statusCode || 500, true, "Error retrieved List Payout Method Types", error.message || error.body || "Unknown error");
        }
    }


    /**
    * Get Payout Required Fields
    * Retrieve the fields required to use a payout method type.
    * 
    * GET /payment/payout_methods/:payout_method_type/required_fields
    */
    static async getPayoutRequiredFields(req, res) {
        const { payout_method_type } = req.params;
        const { ...params } = req.query;

        const searchParams = new URLSearchParams({ ...params }).toString();

        try {
            const httpMethod = 'GET';
            const urlPath = `/v1/payout_methods/${payout_method_type}/required_fields?${searchParams}`;

            // Realiza la solicitud con makeRequest
            const response = await makeRequest(httpMethod, urlPath);

            // Responde al cliente con la data obtenida
            return sendResponse(res, 200, false, "Payout Required Fields retrieved successfully", response, { status: response.body.status });

        } catch (error) {
            console.error("Error retrieved Payout Required Fields:", error);
            return sendResponse(res, error.statusCode || 500, true, "Error retrieved Payout Required Fields", error.message || error.body || "Unknown error");
        }
    }



    /************************************************************************************************
     ************************************************************************************************
     *                                            Wallets
     ************************************************************************************************
     ************************************************************************************************/

    
    /**
    * Create Wallet
    * 
    * POST /payment/ewallets
    */
    static async createWallet(req, res) {
        const { userId } = req.user;
        const { contact, first_name, last_name, type='company', businessId, ...bodyReq } = req.body;

        try {
            // Validar que existe la empresa
            const business = await Business.findByPk(businessId);  
            if (!business) {
                return sendResponse(res, 404, true, "Empresa no encontrada");
            }
            if (business.ownerId !== userId) {
                return sendResponse(res, 404, true, "Acceso denegado: No eres el propietario de la empresa");
            }

            // Crear Wallet en el PSP
            const httpMethod = 'POST';
            const urlPath = `/v1/ewallets`;
            const body = {
                first_name: business.name || first_name,
                last_name,
                type,
                contact,
                ...bodyReq,
            };

            // Realiza la solicitud con makeRequest
            const response = await makeRequest(httpMethod, urlPath, body);

            // Agregar id de la wallet a la DB
            business.PSPWalletId = response.body.data.id;
            const responseUpdatedBusiness = await business.save();

            // Responde al cliente con la data obtenida
            return sendResponse(res, 200, false, "Wallet created successfully", {
                ...responseUpdatedBusiness,
                psp_wallet: response.body.data,
            }, { status: response.body.status });

        } catch (error) {
            console.error("Error creating wallet:", error);
            return sendResponse(res, error.statusCode || 500, true, "Error creating wallet", error.message || error.body || "Unknown error");
        }
    }

    /**
    * Add Contact to Wallet
    * Add a personal contact to a company wallet or client wallet.
    * 
    * POST /payment/ewallets/:wallet/contacts
    */
    static async addContactToWallet(req, res) {
        const { first_name, last_name, date_of_birth, country, address, ...bodyReq } = req.body;

        try {
            const httpMethod = 'POST';
            const urlPath = `/v1/ewallets/:wallet/contacts`;

            const body = {
                first_name,
                last_name,
                date_of_birth,
                country,
                address,
                ...bodyReq,
            };

            // Realiza la solicitud con makeRequest
            const response = await makeRequest(httpMethod, urlPath, body);

            // Responde al cliente con la data obtenida
            return sendResponse(res, 200, false, "Added Contact to Wallet successfully", response.body.data, { status: response.body.status });

        } catch (error) {
            console.error("Error adding contact to Wallet:", error);
            return sendResponse(res, error.statusCode || 500, true, "Error adding contact to Wallet", error.message || error.body || "Unknown error");
        }
    }

}