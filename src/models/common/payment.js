// import { DataTypes } from "sequelize";
// import { sequelize } from "../../config/database.config.js";
// import { Invoice } from "./invoice.js";
// import { User } from "../client/users.js";
// import { Business } from "./business.js";

// export const Payment = sequelize.define('payment', {
//     id: {
//         type: DataTypes.UUID,
//         primaryKey: true,
//         defaultValue: DataTypes.UUIDV4
//     },
//     amount: {
//         type: DataTypes.FLOAT,
//         allowNull: false,
//     },
//     currency: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         defaultValue: 'CLP', // Chilean Pesos
//     },
//     status: {
//         type: DataTypes.ENUM('pending', 'completed', 'failed'),
//         allowNull: false,
//         defaultValue: 'pending',
//     },
//     paymentDate: {
//         type: DataTypes.DATE,
//         defaultValue: DataTypes.NOW,
//     },
//     transactionReference: {
//         type: DataTypes.STRING,
//     },
//     description: {
//         type: DataTypes.TEXT,
//     },
//     voucherNumber: {
//         type: DataTypes.STRING,
//     },
//     metadata: {
//         type: DataTypes.TEXT, // JSON string
//     }
// });

// // Relaciones
// Payment.belongsTo(Invoice, {
//     foreignKey: 'invoiceId',
//     allowNull: false
// });

// Payment.belongsTo(User, {
//     as: 'payer',
//     foreignKey: 'payerId',
//     allowNull: false
// });

// Payment.belongsTo(Business, {
//     foreignKey: 'businessId',
//     allowNull: false
// });

// // Relación inversa
// Invoice.hasMany(Payment, {
//     foreignKey: 'invoiceId'
// }); 