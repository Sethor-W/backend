import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import { Business } from "../common/business.js";
import { UserBusiness } from "./usersBusiness.js";
import { Branch } from "../common/branch.js";

export const EmployeesAssociatedBusinesses = sequelize.define('employees_associated_businesses', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
});


UserBusiness.hasMany(EmployeesAssociatedBusinesses, { onDelete: 'CASCADE' });
Business.hasMany(EmployeesAssociatedBusinesses, { onDelete: 'CASCADE' });
Branch.hasMany(EmployeesAssociatedBusinesses, { onDelete: 'CASCADE' });
EmployeesAssociatedBusinesses.belongsTo(UserBusiness);
EmployeesAssociatedBusinesses.belongsTo(Business);
EmployeesAssociatedBusinesses.belongsTo(Branch);
