import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.config.js";


export const Card = sequelize.define('cards', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  cardholderName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastFourDigits: {
    type: DataTypes.STRING(4),
    allowNull: false
  },
  encryptedCardNumber: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  encryptedExpiryDate: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});
