import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.config.js";
import { User } from "./users.js";


export const IdentityDocument = sequelize.define('IdentityDocuments', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    front_rut: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    back_rut: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    face: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    }
});

User.hasOne(IdentityDocument, {
    foreignKey: {
        allowNull: false,
    },
})
IdentityDocument.belongsTo(User)