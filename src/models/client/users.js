import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.config.js";


export const User = sequelize.define('users', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    resetPasswordCode: {
        type: DataTypes.STRING,
    },
    resetPasswordExpires: {
        type: DataTypes.DATE,
    },
});