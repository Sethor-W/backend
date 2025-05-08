import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import { Business } from "./business.js";

export const Branch = sequelize.define('branch', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    photo: {
        type: DataTypes.STRING,
    },
    country_cca2: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    googleMap: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    main: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        validate: {
            async isUniqueMainBranch(value) {
                // if (value === true) {
                //     const existingMainBranch = await Branch.findOne({ where: { businessId: this.businessId, main: true } });
                //     if (existingMainBranch) {
                //         throw new Error('Ya existe una sucursal principal para este negocio.');
                //     }
                // }
            }
        }
    },
    operatingHours: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {
            monday: { start: '09:00 am', end: '18:00 pm' },
            tuesday: { start: '09:00 am', end: '18:00 pm' },
            wednesday: { start: '09:00 am', end: '18:00 pm' },
            thursday: { start: '09:00 am', end: '18:00 pm' },
            friday: { start: '09:00 am', end: '18:00 pm' },
            saturday: { start: '09:00 am', end: '18:00 pm' },
            sunday: { start: '09:00 am', end: '18:00 pm' },
        },
    },
});


Business.hasMany(Branch, { onDelete: 'CASCADE' });
Branch.belongsTo(Business);
