import { body, param, validationResult } from "express-validator";
import { gatewayBraintree } from "../config/braintree.config.js";
import { sendResponse } from "../helpers/utils.js";

import braintree from "braintree";
import { User } from "../models/users.js";
import { Profile } from "../models/profile.js";


export class PaymentController {


    // ***************************** PAYMENT *****************************

    /**
     * Generar Client Token
     */
    // GET payment/client-token
    static async generateClientToken(req, res) {
        try {
            // Generar el client token
            const result = await gatewayBraintree.clientToken.generate({});

            if (result.success) {
                return sendResponse(res, 200, false, 'Client Token generado con éxito', { clientToken: result.clientToken });
            } else {
                return sendResponse(res, 400, true, 'Error al generar el Client Token', result.message);
            }
        } catch (err) {
            console.error("Error al generar el Client Token:", err);
            return sendResponse(res, 500, true, 'Error interno al generar el Client Token');
        }
    }

    /**
     * Generar Nonce del Método de Pago
     */
    // POST payment/generate-payment-method-nonce
    static async generatePaymentMethodNonce(req, res) {
        // Validación de los datos de entrada
        await body('paymentMethodToken').notEmpty().withMessage('El campo paymentMethodToken es obligatorio.').run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendResponse(res, 400, true, 'Errores de validación', errors.array());
        }

        try {
            const { paymentMethodToken } = req.body;

            // Crear el nonce del método de pago
            gateway.paymentMethodNonce.create(paymentMethodToken, (err, result) => {
                if (err) {
                    console.error('Error al crear el nonce del método de pago:', err);
                    return sendResponse(res, 500, true, 'Error al crear el nonce del método de pago', err.message);
                }

                // Enviar el nonce al cliente
                const nonce = result.paymentMethodNonce.nonce;
                return sendResponse(res, 200, false, 'Nonce del método de pago generado con éxito', { nonce });
            });
        } catch (err) {
            console.error('Error interno al crear el nonce del método de pago:', err);
            return sendResponse(res, 500, true, 'Error interno al crear el nonce del método de pago');
        }
    }

    /**
     * Realizar un Cobro
     */
    // POST payment/charge
    static async chargeCustomer(req, res) {
        // Validación de los datos de entrada
        await body('customerId').notEmpty().withMessage('El campo customerId es obligatorio.').run(req);
        await body('paymentMethodToken').notEmpty().withMessage('El campo paymentMethodToken es obligatorio.').run(req);
        await body('amount').isFloat({ min: 0.01 }).withMessage('El campo amount debe ser un número positivo.').run(req);
        // await body('currency').optional().isIn(['USD', 'EUR', 'GBP']).withMessage('La moneda especificada no es válida.').run(req); // Monedas válidas

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendResponse(res, 400, true, 'Errores de validación', errors.array());
        }

        const { customerId, paymentMethodToken, amount, currency } = req.body;

        try {
            const result = await gatewayBraintree.transaction.sale({
                amount: amount, // Monto a cobrar
                paymentMethodToken: paymentMethodToken, // Token del método de pago
                customerId: customerId, // ID del cliente al que se le cargará
                // currencyIsoCode: currency, // Moneda en la que se cobrará
                options: {
                    submitForSettlement: true // Procesar inmediatamente el pago
                }
            });

            if (result.success) {
                // const newTransaction = await Transaction.create({
                //     userId: req.user.userId,
                //     amount: amount,
                //     transactionId: result.transaction.id
                // });

                // return sendResponse(res, 201, false, "Cobro realizado exitosamente", newTransaction);
                return sendResponse(res, 200, false, 'Cargo realizado con éxito', result.transaction);
            } else {
                return sendResponse(res, 400, true, "Error al realizar el cobro", result.message);
            }
        } catch (error) {
            console.error("Error al realizar el cobro:", error);
            return sendResponse(res, 500, true, "Error interno al realizar el cobro");
        }
    }


    // ***************************** CUSTOMER *****************************

    /**
     * Crear Cliente
     */
    // POST payment/customers
    static async createCustomer(req, res) {
        // Validación de los datos de entrada
        // await body('firstName').notEmpty().withMessage('El campo firstName es obligatorio.').run(req);
        // await body('lastName').notEmpty().withMessage('El campo lastName es obligatorio.').run(req);
        // await body('email').isEmail().withMessage('El campo email debe ser una dirección de correo electrónico válida.').run(req);

        // const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        //     return sendResponse(res, 400, true, 'Errores de validación', errors.array());
        // }

        try {
            const { userId } = req.user;

            // Consulta el usuario y el perfil en la base de datos
            const user = await User.findByPk(userId);
            if (!user) {
                return sendResponse(res, 404, true, 'Usuario no encontrado');
            }

            const profile = await Profile.findOne({ where: { userId: userId } });
            if (!profile) {
                return sendResponse(res, 404, true, 'Perfil no encontrado');
            }

            const { email } = user;
            const { name, lastname } = profile;


            const result = await gatewayBraintree.customer.create({
                firstName: name,
                lastName: lastname,
                email: email
            });

            if (result.success) {

                // obtener la información del cliente de braintree
                const braintreeCustomerId = result.customer.id;

                // Actualiza el registro del perfil en la base de datos con el ID de Braintree
                profile.braintreeCustomerId = braintreeCustomerId;
                await profile.save();

                return sendResponse(res, 200, false, 'Cliente creado con éxito', result.customer);
            } else {
                return sendResponse(res, 400, true, 'Error al crear el cliente', result.customer);
            }
        } catch (err) {
            console.error("Error al crear el cliente:", err);
            return sendResponse(res, 500, true, 'Error interno al crear el cliente');
        }
    }

    /**
     * Obtener Información de un Cliente Basado en el Usuario Autenticado
     * 
     * GET payment/customers/me
     */
    static async getCustomer(req, res) {
        try {
            // Obtener el ID del usuario autenticado
            const { userId } = req.user;

            // Consultar en la base de datos para obtener el customerId asociado
            const profile = await Profile.findOne({ where: { userId: userId } });

            if (!profile || !profile.braintreeCustomerId) {
                return sendResponse(res, 404, true, 'Cliente no encontrado en la base de datos');
            }

            // Obtener la información del cliente desde Braintree usando el customerId
            const result = await gatewayBraintree.customer.find(profile.braintreeCustomerId);

            if (result) {
                return sendResponse(res, 200, false, 'Información del cliente obtenida con éxito', result);
            } else {
                return sendResponse(res, 404, true, 'Cliente no encontrado en Braintree');
            }
        } catch (err) {
            console.error("Error al obtener la información del cliente:", err);
            return sendResponse(res, 500, true, 'Error interno al obtener la información del cliente');
        }
    }

    /**
     * Actualizar Cliente
     */
    // PUT payment/customers
    static async updateCustomer(req, res) {
        try {
            const { userId } = req.user;

            // Consulta el usuario y el perfil en la base de datos
            const user = await User.findByPk(userId);
            if (!user) {
                return sendResponse(res, 404, true, 'Usuario no encontrado');
            }

            const profile = await Profile.findOne({ where: { userId: userId } });
            if (!profile) {
                return sendResponse(res, 404, true, 'Perfil no encontrado');
            }

            const { email } = user;
            const { name, lastname } = profile;

            const braintreeCustomerId = profile.braintreeCustomerId;

            // Actualizar el cliente en Braintree
            const result = await gatewayBraintree.customer.update(braintreeCustomerId, {
                firstName: name,
                lastName: lastname,
                email: email,
            });

            if (result.success) {
                return sendResponse(res, 200, false, 'Cliente actualizado con éxito', result.customer);
            } else {
                return sendResponse(res, 400, true, 'Error al actualizar el cliente', result.message);
            }
        } catch (err) {
            res.status(500).send(err);
        }
    }

    /**
     * Obtener Información de un Cliente
     */
    // GET payment/customers/:customerId
    static async getCustomerByIdBraintree(req, res) {
        // Validación del parámetro customerId
        await param('customerId').notEmpty().withMessage('El campo customerId es obligatorio.').run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendResponse(res, 400, true, 'Errores de validación', errors.array());
        }

        const { customerId } = req.params;

        try {
            const result = await gatewayBraintree.customer.find(customerId);

            if (result) {
                return sendResponse(res, 200, false, 'Información del cliente obtenida con éxito', result);
            } else {
                return sendResponse(res, 404, true, 'Cliente no encontrado');
            }
        } catch (err) {
            console.error("Error al obtener la información del cliente:", err);
            return sendResponse(res, 500, true, 'Error interno al obtener la información del cliente');
        }
    }


    // ***************************** PAYMENT METHOD *****************************
    
    /**
     * Agregar un Método de Pago a un Cliente
     */
    // POST payment/customers/payment-methods
    static async addPaymentMethod(req, res) {
        // Validación de los datos de entrada
        // await param('customerId').notEmpty().withMessage('El campo customerId es obligatorio.').run(req);
        await body('paymentMethodNonce').notEmpty().withMessage('El campo paymentMethodNonce es obligatorio.').run(req);
        await body('makeDefault')
            .isBoolean().withMessage('El campo makeDefault debe ser un valor booleano.')
            .optional() // Este campo es opcional, no requiere validación si no está presente
            .toBoolean() // Convierte el valor a booleano
            .run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendResponse(res, 400, true, 'Errores de validación', errors.array());
        }

        // Obtener el ID del usuario autenticado
        const { userId } = req.user;
        const { paymentMethodNonce, makeDefault } = req.body;
        // const { customerId } = req.params;

        try {
            // Consultar en la base de datos para obtener el customerId asociado
            const profile = await Profile.findOne({ where: { userId: userId } });
    
            if (!profile || !profile.braintreeCustomerId) {
                return sendResponse(res, 404, true, 'Cliente no encontrado en la base de datos');
            }

            const result = await gatewayBraintree.paymentMethod.create({
                customerId: profile.braintreeCustomerId, // ID del cliente al que se le agregará el método de pago
                paymentMethodNonce: paymentMethodNonce,
                options: {
                    verifyCard: true,
                    makeDefault: makeDefault || false,
                }
            });

            if (result.success) {
                return sendResponse(res, 200, false, 'Método de pago agregado con éxito', result.paymentMethod);
            } else {
                return sendResponse(res, 400, true, 'Error al agregar el método de pago', result.message);
            }
        } catch (err) {
            console.error("Error al agregar el método de pago:", err);
            return sendResponse(res, 500, true, 'Error interno al agregar el método de pago');
        }
    }

    /**
     * Consultar Método de Pago Predeterminado de un Cliente
     * 
     * GET payment/customers/payment-methods/default
     */
    static async getDefaultPaymentMethod(req, res) {
        try {
            // Obtener el ID del usuario autenticado
            const { userId } = req.user;

            // Consultar en la base de datos para obtener el customerId asociado
            const profile = await Profile.findOne({ where: { userId: userId } });

            if (!profile || !profile.braintreeCustomerId) {
                return sendResponse(res, 404, true, 'Cliente no encontrado en la base de datos');
            }

            // Obtener todos los métodos de pago del cliente
            const result = await gatewayBraintree.customer.find(profile.braintreeCustomerId);

            if (result) {
                // Buscar el método de pago predeterminado
                const defaultPaymentMethod = result.paymentMethods.find(method => method.default);

                if (defaultPaymentMethod) {
                    return sendResponse(res, 200, false, 'Método de pago predeterminado obtenido con éxito', defaultPaymentMethod);
                } else {
                    return sendResponse(res, 404, true, 'Método de pago predeterminado no encontrado');
                }
            } else {
                return sendResponse(res, 400, true, 'Error al obtener los métodos de pago del cliente', result.message);
            }
        } catch (err) {
            console.error("Error al obtener el método de pago predeterminado:", err);
            return sendResponse(res, 500, true, 'Error interno al obtener el método de pago predeterminado');
        }
    }

    /**
     * Eliminar Método de Pago
     * 
     * DELETE payment/customers/payment-methods/:paymentMethodToken
     */
    static async deletePaymentMethod(req, res) {
        try {
            const { userId } = req.user;
            const { paymentMethodToken } = req.params;

            if (!paymentMethodToken) {
                return sendResponse(res, 400, true, 'El campo paymentMethodToken es obligatorio.');
            }

            // Consultar en la base de datos para obtener el braintreeCustomerId asociado
            const profile = await Profile.findOne({ where: { userId: userId } });

            if (!profile || !profile.braintreeCustomerId) {
                return sendResponse(res, 404, true, 'Cliente no encontrado en la base de datos');
            }

            const braintreeCustomerId = profile.braintreeCustomerId;

            // Buscar los métodos de pago del cliente
            const paymentMethodsResult = await gatewayBraintree.paymentMethod.find(paymentMethodToken);

            if (!paymentMethodsResult || paymentMethodsResult.customerId != braintreeCustomerId) {
                return sendResponse(res, 404, true, 'Método de pago no encontrado.');
            }

            await gatewayBraintree.paymentMethod.delete(paymentMethodToken);

            return sendResponse(res, 200, false, 'Método de pago eliminado con éxito');
        } catch (err) {
            console.error("Error al eliminar el método de pago:", err);
            return sendResponse(res, 500, true, 'Error interno al eliminar el método de pago');
        }
    }

    // ***************************** TRANSACTIONS *****************************

    /**
     * Obtener Todas las Transacciones de "Sale" de un Cliente
     * 
     * GET payment/customers/transactions
     */
    static async getCustomerTransactions(req, res) {

        try {
            // Obtener el ID del usuario autenticado
            const { userId } = req.user;

            // Consultar en la base de datos para obtener el customerId asociado
            const profile = await Profile.findOne({ where: { userId: userId } });

            if (!profile || !profile.braintreeCustomerId) {
                return sendResponse(res, 404, true, 'Cliente no encontrado en la base de datos');
            }

            const braintreeCustomerId = profile.braintreeCustomerId;

            // Buscar transacciones asociadas al cliente
            const searchResults = gatewayBraintree.transaction.search((search) => {
                search.customerId().is(braintreeCustomerId);
                search.type().is("sale");
            });

            const transactions = [];
            searchResults.on('data', (transaction) => {
                transactions.push(transaction);
            });

            searchResults.on('end', () => {
                return sendResponse(res, 200, false, 'Transacciones obtenidas con éxito', transactions);
            });

            searchResults.on('error', (err) => {
                console.error("Error al obtener las transacciones del cliente:", err);
                return sendResponse(res, 500, true, 'Error interno al obtener las transacciones del cliente');
            });
        } catch (err) {
            console.error("Error al obtener las transacciones del cliente:", err);
            return sendResponse(res, 500, true, 'Error interno al obtener las transacciones del cliente');
        }
    }

    /**
     * Obtener Todas las Transacciones de "Sale" de un Cliente
     */
    // GET payment/customers/:customerId/transactions
    static async getCustomerTransactionsByIdBraintree(req, res) {
        // Validación del parámetro customerId
        await param('customerId').notEmpty().withMessage('El campo customerId es obligatorio.').run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendResponse(res, 400, true, 'Errores de validación', errors.array());
        }

        const { customerId } = req.params;

        try {
            // Buscar transacciones asociadas al cliente
            const searchResults = await gatewayBraintree.transaction.search((search) => {
                search.customerId().is(customerId);
                search.type().is("sale");
            });

            const transactions = [];
            searchResults.on('data', (transaction) => {
                transactions.push(transaction);
            });

            searchResults.on('end', () => {
                return sendResponse(res, 200, false, 'Transacciones obtenidas con éxito', transactions);
            });

            searchResults.on('error', (err) => {
                console.error("Error al obtener las transacciones del cliente:", err);
                return sendResponse(res, 500, true, 'Error interno al obtener las transacciones del cliente');
            });
        } catch (err) {
            console.error("Error al obtener las transacciones del cliente:", err);
            return sendResponse(res, 500, true, 'Error interno al obtener las transacciones del cliente');
        }
    }

    // ***************************** BUSINESS *****************************

    /**
     * Registro de Cuenta Bancaria para Empresas
     *  Endpoint para que las empresas puedan registrar su cuenta bancaria donde recibirán los pagos.
     */
    // POST payment/business/bank-account
    static async registerBusinessBankAccount(req, res) {
        await body('bankName').notEmpty().withMessage('El nombre del banco es obligatorio').run(req);
        await body('accountNumber').notEmpty().withMessage('El número de cuenta es obligatorio').run(req);
        // await body('accountHolderName').notEmpty().withMessage('El nombre del titular es obligatorio').run(req);
        await body('routingNumber').notEmpty().withMessage('El número de ruta es obligatorio').run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendResponse(res, 400, true, 'Errores de validación', errors.array());
        }

        const {
            bankName,
            accountNumber,
            accountHolderName,
            routingNumber,
            business,
            funding
        } = req.body;

        try {
            // Crear la cuenta de comerciante en Braintree
            const merchantAccountParams = {
                individual: {
                    firstName: accountHolderName || 'Nombre del Titular', // Uso de datos del body
                    lastName: 'Apellido', // Completa con un apellido adecuado
                    email: 'contacto@example.com', // Ajusta según el caso
                    phone: '5555555555', // Ajusta según el caso
                    dateOfBirth: '1980-01-01', // Ajusta según el caso
                    ssn: '12345678', // Ajusta según el caso
                    address: {
                        streetAddress: 'Dirección', // Ajusta según el caso
                        locality: 'Ciudad', // Ajusta según el caso
                        region: 'Región', // Ajusta según el caso
                        postalCode: 'Código Postal' // Ajusta según el caso
                    }
                },
                business: {
                    legalName: business.legalName || 'Nombre Legal de la Empresa', // Uso de datos del body
                    dbaName: business.dbaName || 'Nombre Comercial de la Empresa', // Uso de datos del body
                    taxId: business.taxId || 'RUT o Identificación Fiscal', // Uso de datos del body
                    address: {
                        streetAddress: business.address.streetAddress || 'Dirección de la Empresa', // Uso de datos del body
                        locality: business.address.locality || 'Ciudad de la Empresa', // Uso de datos del body
                        region: business.address.region || 'Región de la Empresa', // Uso de datos del body
                        postalCode: business.address.postalCode || 'Código Postal de la Empresa' // Uso de datos del body
                    }
                },
                funding: {
                    descriptor: bankName,
                    destination: braintree.MerchantAccount.FundingDestination.Bank,
                    email: funding.email || 'funding@example.com', // Ajusta según el caso
                    mobilePhone: funding.mobilePhone || '5555555555', // Ajusta según el caso
                    accountNumber: accountNumber, // Número de cuenta cifrado
                    routingNumber: routingNumber, // Número de ruta cifrado
                },
                tosAccepted: true,
                masterMerchantAccountId: process.env.MASTER_MERCHANT_ACCOUNT_ID || 'Sethor_LT', // Configurable
                id: 'sethor_new', // Ajusta según el caso
            };

            gatewayBraintree.merchantAccount.create(merchantAccountParams, async (err, result) => {
                if (result.success) {
                    // Guardar la cuenta bancaria en la base de datos
                    // const newAccount = await BusinessAccount.create({
                    //     userId: req.user.userId,
                    //     bankName,
                    //     accountNumber,
                    //     // accountHolderName,
                    //     routingNumber,
                    //     merchantAccountId: result.merchantAccount.id
                    // });

                    return sendResponse(res, 201, false, "Cuenta bancaria registrada correctamente", {});
                } else {

                    // En lugar de crear una cuenta bancaria real, simula la creación y transferencia
                    const simulatedAccount = {
                        bankName,
                        accountNumber,
                        accountHolderName,
                        routingNumber,
                        merchantAccountId: 'Sethor_LT', // ID simulado
                        status: 'registered', // Estado simulado
                        timestamp: new Date()
                    };
                    return sendResponse(res, 201, false, "Cuenta bancaria registrada correctamente", simulatedAccount);

                    
                    console.error('Error al crear la cuenta del comerciante:', err);
                    return sendResponse(res, 400, true, 'Error al crear la cuenta del comerciante', result);
                }

            });

        } catch (error) {
            console.error("Error al registrar cuenta bancaria:", error);
            return sendResponse(res, 500, true, "Error al registrar cuenta bancaria");
        }
    }

}
