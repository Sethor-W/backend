import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import { invoiceStatusEnum } from "../../enum/invoiceStatus.enum.js";
import { Business } from "./business.js";
import { UserBusiness } from "../business/usersBusiness.js";
import { User } from "../client/users.js";
import { Branch } from "./branch.js";
import { discountTypeEnum } from "../../enum/discountType.enum.js";

export const Invoice = sequelize.define('invoice', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    note: {
        type: DataTypes.TEXT,
    },
    status: {
        type: DataTypes.ENUM(invoiceStatusEnum.DRAFT, invoiceStatusEnum.PAID),
        allowNull: false,
        defaultValue: invoiceStatusEnum.DRAFT,
    },
    dateTimePayment: {
        // type: DataTypes.STRING,
        type: DataTypes.DATE,
    },
    voucherNumber: {
        type: DataTypes.STRING,
    },
    products: {
        type: DataTypes.TEXT,
    },
    discountValue: {
        type: DataTypes.FLOAT,
    },
    discountType: {
        type: DataTypes.ENUM(discountTypeEnum.FIXED, discountTypeEnum.PERCENTAGE),
        allowNull: false,
    },
    subtotal: {
        type: DataTypes.FLOAT,
    },
    sth: {
        type: DataTypes.FLOAT,
    },
    totalIVA: {
        type: DataTypes.FLOAT,
    },
    totalGeneral: {
        type: DataTypes.FLOAT,
    },
    currency: {
        type: DataTypes.STRING,
    },
});


Invoice.belongsTo(UserBusiness, {
    as: 'collector',
    foreignKey: 'collectorId',
    allowNull: false
});
Invoice.belongsTo(Business, {
    allowNull: false
});
Invoice.belongsTo(Branch, {
    allowNull: false
});
Invoice.belongsTo(User, {
    as: 'client',
    foreignKey: 'clientId',
});