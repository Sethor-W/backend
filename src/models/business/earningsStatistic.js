import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import { Business } from "../common/business.js";


export const EarningsStatistic  = sequelize.define('earningsStatistic', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    totalEarnings: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
});

EarningsStatistic.belongsTo(Business, {
    foreignKey: {
        allowNull: false,
        name: 'businessId',
    },
})