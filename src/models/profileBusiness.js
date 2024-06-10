import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.config.js";
import { UserBusiness } from "./usersBusiness.js";


export const ProfileBusiness = sequelize.define('profiles_business', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    codeEmployee: {
        type: DataTypes.STRING,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rut: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    additionalData: {
        type: DataTypes.JSON,
    },
    profilePicture: {
        type: DataTypes.STRING,
    },
});

UserBusiness.hasOne(ProfileBusiness, {
    foreignKey: {
        allowNull: false,
    },
})
ProfileBusiness.belongsTo(UserBusiness)