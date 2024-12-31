import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import { functionsBusinessEnum } from "../../enum/functionsBusiness.enum.js";


export const BusinessFunction  = sequelize.define('business_function', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    }
});

// Hook para autorellenar la tabla de roles
BusinessFunction.afterSync(() => {
    const functions = [
        functionsBusinessEnum.GESTION_COBRADORES,
        functionsBusinessEnum.GESTION_ESTADISTICAS,
        functionsBusinessEnum.GESTION_SUCURSALES,
        functionsBusinessEnum.GESTION_INVENTARIO,
        functionsBusinessEnum.HISTORIAL_VENTAS,
    ];

    functions.forEach(async (func) => {
        await BusinessFunction.findOrCreate({ where: { name: func.name }, defaults: func });
    });

});