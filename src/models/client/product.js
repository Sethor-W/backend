import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import { Branch } from "../common/branch.js";
import { Business } from "../common/business.js";
import { typeProductEnum } from "../../enum/typeProduct.enum.js";


export const Product = sequelize.define('product', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
    },
    offer: {
        type: DataTypes.FLOAT,
    },
    type: {
        type: DataTypes.ENUM(typeProductEnum.INDIVIDUAL, typeProductEnum.COMBO, typeProductEnum.OFFER),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    photos: {
        type: DataTypes.TEXT
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    profilePicture: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

Branch.hasMany(Product, { onDelete: 'CASCADE' });
Product.belongsTo(Business);
Product.belongsTo(Branch);
