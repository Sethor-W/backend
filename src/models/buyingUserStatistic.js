import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.config.js";
import { Business } from "./business.js";
import { User } from "./users.js";


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
    amountPaidByTheUser: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
});

BuyingUserStatistic.belongsTo(Business, {
    foreignKey: {
        allowNull: false,
        name: 'businessId',
    },
})
BuyingUserStatistic.belongsTo(User, {
    foreignKey: {
        allowNull: false,
        name: 'userId',
    },
})