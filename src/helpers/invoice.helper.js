// invoiceUtils.js

import { discountTypeEnum } from "../enum/discountType.enum.js";


export function calculateInvoiceValues(products, discountType, discountValue) {
    // Calcular subtotal
    let subtotal = 0;
    products.forEach(product => {
        const productTotal = product.price * product.quantity;
        const discount =
            product.discountType === discountTypeEnum.PERCENTAGE
                ? (product.discountValue / 100) * productTotal
                : product.discountValue;
        
        const amountProductTotal = productTotal - discount
        subtotal += amountProductTotal;
        // console.log({productTotal, discount, amountProductTotal})
        // console.log({subtotal})
        
    });


    // Aplicar descuento general si se envía
    let generalDiscount = 0;
    if (discountType && discountValue) {
        generalDiscount =
            discountType === discountTypeEnum.PERCENTAGE
                ? (discountValue / 100) * subtotal
                : discountValue;
        subtotal -= generalDiscount;
    }

    // Redondear valores a 2 decimales
    subtotal = Math.round(subtotal * 100) / 100;

    const sth = Math.round((subtotal * 0.05) * 100) / 100; // 5% del subtotal
    const totalIVA = Math.round((subtotal * 0.10) * 100) / 100; // 10% del subtotal
    const totalGeneral = Math.round((subtotal + sth + totalIVA) * 100) / 100;

    // const sth = subtotal * 0.05; // (ejemplo: 5% del subtotal como un impuesto adicional)
    // const totalIVA = subtotal * 0.10; // Calcular IVA (ejemplo: 10% del subtotal)
    // const totalGeneral = subtotal + sth + totalIVA;

    return {
        subtotal,
        generalDiscount,
        sth,
        totalIVA,
        totalGeneral
    };
}
