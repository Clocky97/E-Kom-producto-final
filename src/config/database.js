import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD, {
        host : process.env.DB_HOST,
        dialect: process.env.DIALECT
    }
);

export const stardDB = async () => {
    try {
        sequelize.authenticate();
        sequelize.sync();
    } catch (error) {
        console.log(error)
    }
}