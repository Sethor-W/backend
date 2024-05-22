import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.config.js";
import { Business } from "./business.js";


export const BuyingUserStatistic  = sequelize.define('buyingUserStatistic', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    userCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

BuyingUserStatistic.belongsTo(Business, {
    foreignKey: {
        allowNull: false,
        name: 'businessId',
    },
})