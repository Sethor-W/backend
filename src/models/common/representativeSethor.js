import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.config.js";

export const RepresentativeSethor = sequelize.define('representative_sethor', {
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
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
});
