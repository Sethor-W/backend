import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import { User } from "./users.js";


export const OneClickCard = sequelize.define('oneClickCards', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    tbk_user: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    card_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last4_card_digits: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    authorization_code: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

User.hasOne(OneClickCard, {
    foreignKey: {
        allowNull: false,
    },
})
OneClickCard.belongsTo(User)