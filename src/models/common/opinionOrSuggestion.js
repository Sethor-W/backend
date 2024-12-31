import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import { typeUserEnum } from "../../enum/typeUser.enum.js";

export const OpinionOrSuggestion = sequelize.define('opinion_or_Suggestion', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    detail: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    docs: {
        type: DataTypes.TEXT
    },
    userType: {
        type: DataTypes.ENUM(typeUserEnum.USER_BUSINESS, typeUserEnum.USER_CLIENT),
        allowNull: false
    },
});
