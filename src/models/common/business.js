import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import { UserBusiness } from "../business/usersBusiness.js";


export const Business = sequelize.define('business', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rut_business: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tax_code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    address: {
        type: DataTypes.STRING,
    },
    profilePicture: {
        type: DataTypes.STRING,
    },
    coverPicture: {
        type: DataTypes.STRING,
    },
    validated_business: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    validated_business: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    PSPWalletId: {
        type: DataTypes.STRING,
    }
});

Business.belongsTo(UserBusiness, {
    foreignKey: {
        allowNull: false,
        name: 'ownerId',
    },
})