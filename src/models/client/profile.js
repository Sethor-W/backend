import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.config.js";
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
    PSPCustomerId: {
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
    profilePicture: {
        type: DataTypes.STRING,
    },
    handRight: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    handLeft: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
});

User.hasOne(Profile, {
    foreignKey: {
        allowNull: false,
    },
})
Profile.belongsTo(User)