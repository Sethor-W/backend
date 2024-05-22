import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.config.js";
import { User } from "./users.js";


export const Profile = sequelize.define('profiles', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    codeUser: {
        type: DataTypes.STRING,
        allowNull: false,
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
    }
});

User.hasOne(Profile, {
    foreignKey: {
        allowNull: false,
    },
})
Profile.belongsTo(User)