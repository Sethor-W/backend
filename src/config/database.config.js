import { Sequelize } from "sequelize";

const {
  DB_NAME,
  DB_DIALECT,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_PORT,
} = process.env;

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD,{
  host: DB_HOST,
  dialect: DB_DIALECT,
  port: DB_PORT,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Esto evita problemas con certificados autofirmados
    }
  }
})


// Probando la conexión
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida correctamente.');
  })
  .catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
  });
