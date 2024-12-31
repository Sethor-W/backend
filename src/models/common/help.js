import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import { typeUserEnum } from "../../enum/typeUser.enum.js";

export const Help = sequelize.define('help', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    contactNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    detail: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    docs: {
        type: DataTypes.TEXT
    },
    userType: {
        type: DataTypes.ENUM(typeUserEnum.USER_BUSINESS, typeUserEnum.USER_CLIENT),
        allowNull: false
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
});
