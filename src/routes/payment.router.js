import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller.js';
import { verifyTokenMiddleware } from '../middlewares/verifyToken.middleware.js';



export const routerPayment = Router();

// // Payment
// routerPayment.get('/client-token', PaymentController.generateClientToken);
// routerPayment.get('/generate-payment-method-nonce', PaymentController.generatePaymentMethodNonce);
// routerPayment.post('/charge', PaymentController.chargeCustomer);

// // Customers
// routerPayment.post('/customers', [
//     verifyTokenMiddleware,
// ], PaymentController.createCustomer);

// routerPayment.get('/customers', [
//     verifyTokenMiddleware,
// ], PaymentController.getCustomer);

// routerPayment.put('/customers', [
//     verifyTokenMiddleware,
// ], PaymentController.updateCustomer);


// // Payment Methods

// routerPayment.post('/customers/payment-methods/create', [
//     verifyTokenMiddleware,
// ], PaymentController.addPaymentMethod);

// routerPayment.get('/customers/payment-methods/default', [
//     verifyTokenMiddleware,
// ], PaymentController.getDefaultPaymentMethod);

// routerPayment.delete('/customers/payment-methods/:paymentMethodToken', [
//     verifyTokenMiddleware,
// ], PaymentController.deletePaymentMethod);


// // Transactions

// routerPayment.get('/customers/transactions', [
//     verifyTokenMiddleware,
// ], PaymentController.getCustomerTransactions);



// // By Braintree ID

// routerPayment.get('/customers/:customerId', [
//     verifyTokenMiddleware,
// ], PaymentController.getCustomerByIdBraintree);

// routerPayment.get('/customers/:customerId/transactions', [
//     verifyTokenMiddleware,
// ], PaymentController.getCustomerTransactionsByIdBraintree);

// routerPayment.post('/business/bank-account', [
//     // verifyTokenMiddleware,
// ], PaymentController.registerBusinessBankAccount);









routerPayment.post('/customers', [
    verifyTokenMiddleware,
], PaymentController.createCustomer);

routerPayment.post('/customers/:customer', [
    verifyTokenMiddleware,
], PaymentController.updateCustomer);

routerPayment.get('/customers/PSPCustomerId', [
    verifyTokenMiddleware,
], PaymentController.retrieveCustomer);




routerPayment.post('/hosted/collect/card', [
    verifyTokenMiddleware,
], PaymentController.createCardToken);

routerPayment.post('/customers/:customer/payment_methods', [
    verifyTokenMiddleware,
], PaymentController.addPaymentMethodOfCustomer);

routerPayment.get('/customers/PSPCustomerId/payment_methods', [
    verifyTokenMiddleware,
], PaymentController.listPaymentMethodsOfCustomer);

routerPayment.delete('/customers/PSPCustomerId/payment_methods/:payment_method', [
    verifyTokenMiddleware,
], PaymentController.deletePaymentMethod);




routerPayment.post('/payments', [
    verifyTokenMiddleware,
], PaymentController.createPayment);

routerPayment.get('/payments/:payment', [
    verifyTokenMiddleware,
], PaymentController.retrievePayment);

routerPayment.get('/payments', [
    verifyTokenMiddleware,
], PaymentController.listPayments);




routerPayment.post('/payouts', [
    verifyTokenMiddleware,
], PaymentController.createPayout);

routerPayment.post('/payouts/confirm/:payout', [
    verifyTokenMiddleware,
], PaymentController.confirmPayoutWithFX);





routerPayment.get('/payout_methods', [
    // verifyTokenMiddleware,
], PaymentController.listPayoutMethodTypes);

routerPayment.get('/payout_methods/:payout_method_type/required_fields', [
    // verifyTokenMiddleware,
], PaymentController.getPayoutRequiredFields);






routerPayment.post('/beneficiary', [
    // verifyTokenMiddleware,
], PaymentController.beneficiary);



routerPayment.post('/ewallets', [
    verifyTokenMiddleware,
], PaymentController.createWallet);

routerPayment.post('/ewallets/:wallet/contacts', [
    verifyTokenMiddleware,
], PaymentController.addContactToWallet);







routerPayment.get('/data/countries', [
    // verifyTokenMiddleware,
], PaymentController.listCountries);

routerPayment.get('/data/fx_rates', [
    // verifyTokenMiddleware,
], PaymentController.getFXRate);
