import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.config.js";
import { UserBusinessRole } from "./userBusinessRoles.js";
import { actuveAccountEnum } from "../enum/activeAccount.enum.js";


export const UserBusiness = sequelize.define('users_business', {
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
    keyword: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    credential: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM(actuveAccountEnum.ACTIVE, actuveAccountEnum.DESACTIVED),
        allowNull: false,
        defaultValue: actuveAccountEnum.ACTIVE
    }
});

// Roles
UserBusinessRole.hasMany(UserBusiness, {
    foreignKey: {
        allowNull: false,
    },
})
UserBusiness.belongsTo(UserBusinessRole)
