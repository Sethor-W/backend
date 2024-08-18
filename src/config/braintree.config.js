import braintree from "braintree";

const {
    BRAINTREE_MERCHANT_ID,
    BRAINTREE_PUBLIC_KEY,
    BRAINTREE_PRIVATE_KEY,
} = process.env;
          
export const gatewayBraintree = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox, // Cambiar a Production en producción
    merchantId: BRAINTREE_MERCHANT_ID,
    publicKey: BRAINTREE_PUBLIC_KEY,
    privateKey: BRAINTREE_PRIVATE_KEY,
});