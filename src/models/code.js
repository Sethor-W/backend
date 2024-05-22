import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.config.js";


export const Code = sequelize.define('codes', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});
