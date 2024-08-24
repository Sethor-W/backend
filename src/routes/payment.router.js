import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller.js';
import { verifyTokenMiddleware } from '../middlewares/verifyToken.middleware.js';



export const routerPayment = Router();

// Payment
routerPayment.get('/client-token', PaymentController.generateClientToken);
routerPayment.get('/generate-payment-method-nonce', PaymentController.generatePaymentMethodNonce);
routerPayment.post('/charge', PaymentController.chargeCustomer);

// Customers
routerPayment.post('/customers', [
    verifyTokenMiddleware,
], PaymentController.createCustomer);

routerPayment.get('/customers', [
    verifyTokenMiddleware,
], PaymentController.getCustomer);

routerPayment.put('/customers', [
    verifyTokenMiddleware,
], PaymentController.updateCustomer);


// Payment Methods

routerPayment.post('/customers/payment-methods/create', [
    verifyTokenMiddleware,
], PaymentController.addPaymentMethod);

routerPayment.get('/customers/payment-methods/default', [
    verifyTokenMiddleware,
], PaymentController.getDefaultPaymentMethod);

routerPayment.delete('/customers/payment-methods/:paymentMethodToken', [
    verifyTokenMiddleware,
], PaymentController.deletePaymentMethod);


// Transactions

routerPayment.get('/customers/transactions', [
    verifyTokenMiddleware,
], PaymentController.getCustomerTransactions);



// By Braintree ID

routerPayment.get('/customers/:customerId', [
    verifyTokenMiddleware,
], PaymentController.getCustomerByIdBraintree);

routerPayment.get('/customers/:customerId/transactions', [
    verifyTokenMiddleware,
], PaymentController.getCustomerTransactionsByIdBraintree);

routerPayment.post('/business/bank-account', [
    // verifyTokenMiddleware,
], PaymentController.registerBusinessBankAccount);



