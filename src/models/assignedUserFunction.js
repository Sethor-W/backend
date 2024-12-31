import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.config.js";

import { BusinessFunction } from "./business/businessFunction.js";
import { UserBusiness } from "./business/usersBusiness.js";


export const AssignedUserFunction  = sequelize.define('assigned_user_function', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    }
});

AssignedUserFunction.belongsTo(UserBusiness);
AssignedUserFunction.belongsTo(BusinessFunction);
