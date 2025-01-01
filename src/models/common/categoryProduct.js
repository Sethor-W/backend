import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import { Business } from "./business.js";


export const CategoryProduct = sequelize.define('category_product', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

Business.hasMany(CategoryProduct,{
    foreignKey: {
        name: 'businessId',
        allowNull: false,
    },
    onDelete: 'CASCADE',
    as: 'categoryProducts',
 });
CategoryProduct.belongsTo(Business, {
    foreignKey: {
        name: 'businessId',
        allowNull: false,
    },
    as: 'business',
});