import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.config.js";
import { Business } from "./business.js";


export const SoldProductStatistic  = sequelize.define('soldProductStatistic', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    soldCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

SoldProductStatistic.belongsTo(Business, {
    foreignKey: {
        allowNull: false,
        name: 'businessId',
    },
})