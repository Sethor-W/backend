import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import { availableCountriesEnum } from "../../enum/availableCountry.enum.js";

export const AvailableCountry = sequelize.define('available_country', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    country: {
        type: DataTypes.STRING,
    },
    currency: {
        type: DataTypes.STRING,
    },
    telephonePrefix: {
        type: DataTypes.STRING,
    },
    phoneMaxLength: {
        type: DataTypes.INTEGER,
    },
});

// Hook para autorellenar la tabla de roles
AvailableCountry.afterSync(async() => {
    const countries = Object.values(availableCountriesEnum); 
    countries.forEach(async (country) => {
        await AvailableCountry.findOrCreate({
            where: { country: country.country }, // Evitar duplicados
            defaults: {
                currency: country.currency,
                telephonePrefix: country.telephonePrefix,
                phoneMaxLength: country.phoneMaxLength,
            }
        });
    });
});