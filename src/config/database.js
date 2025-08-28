import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT || 1212,
    }
);

export const startDB = () => {
    try {
        sequelize.authenticate();
        console.log("La base de datos se conectó correctamente");
        sequelize.sync({alter:true});
    }catch (error){
        console.log(`Error al conectarse con la base de datos`, error);
    }
};