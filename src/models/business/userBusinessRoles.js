import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import { rolesEnum } from "../../enum/roles.enum.js";

export const UserBusinessRole = sequelize.define('user_business_roles', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    role: {
        type: DataTypes.ENUM(rolesEnum.OWNER, rolesEnum.MANAGER, rolesEnum.COLLECTOR, rolesEnum.ADMIN),
        allowNull: false,
        unique: true
    }
});

// Hook para autorellenar la tabla de roles
// UserBusinessRole.afterSync(() => {
//     const roles = [rolesEnum.OWNER, rolesEnum.MANAGER, rolesEnum.COLLECTOR, rolesEnum.ADMIN];
//     roles.forEach(async (role) => {
//         await UserBusinessRole.findOrCreate({ where: { role } });
//     });
// });

UserBusinessRole.afterSync(async () => {
    const roles = [rolesEnum.OWNER, rolesEnum.MANAGER, rolesEnum.COLLECTOR, rolesEnum.ADMIN];

    for (const role of roles) {
        try {
            await UserBusinessRole.findOrCreate({ where: { role } });
            console.log(`Rol ${role} insertado o ya existente.`);
        } catch (error) {
            console.error(`❌ Error al insertar el rol ${role}:`, error);
        }
    }
});