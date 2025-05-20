// invoiceUtils.js

import { discountTypeEnum } from "../enum/discountType.enum.js";


export function calculateInvoiceValues(products, discountType, discountValue) {
    // Validate inputs
    if (!Array.isArray(products) || products.length === 0) {
        throw new Error('Products must be a non-empty array');
    }

    // Calculate subtotal with product discounts
    let subtotal = products.reduce((acc, product) => {
        // Validate product values
        if (!product.price || !product.quantity || product.price < 0 || product.quantity < 0) {
            throw new Error('Invalid product price or quantity');
        }

        const productTotal = product.price * product.quantity;
        let productDiscount = 0;

        // Calculate product discount if applicable
        if (product.discountType && product.discountValue) {
            if (product.discountType === discountTypeEnum.PERCENTAGE) {
                productDiscount = (product.discountValue / 100) * productTotal;
            } else if (product.discountType === discountTypeEnum.FIXED) {
                productDiscount = product.discountValue;
            }
        }

        return acc + (productTotal - productDiscount);
    }, 0);

    // Calculate general discount
    let generalDiscount = 0;
    if (discountType && discountValue) {
        if (discountType === discountTypeEnum.PERCENTAGE) {
            generalDiscount = (discountValue / 100) * subtotal;
        } else if (discountType === discountTypeEnum.FIXED) {
            generalDiscount = discountValue;
        }
        subtotal -= generalDiscount;
    }

    // Ensure subtotal is not negative
    subtotal = Math.max(0, subtotal);

    // Calculate taxes and total with proper rounding
    const roundToTwoDecimals = (num) => Math.round(num * 100) / 100;
    
    subtotal = roundToTwoDecimals(subtotal);
    const sth = roundToTwoDecimals(subtotal * 0.05); // 5% of subtotal
    const totalIVA = roundToTwoDecimals(subtotal * 0.10); // 10% of subtotal
    const totalGeneral = roundToTwoDecimals(subtotal + sth + totalIVA);

    return {
        subtotal,
        generalDiscount,
        sth,
        totalIVA,
        totalGeneral
    };
}
