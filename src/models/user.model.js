import {sequelize} from "../config/database.js";
import { DataTypes } from "sequelize";

export const User = sequelize.define("user", {
    id: {primaryKey: true, allowNull: false, type: DataTypes.INTEGER, autoIncrement: true},
    name: {type: DataTypes.STRING(100), allowNull: false},
    email: {type: DataTypes.STRING(100), allowNull: false, unique: true},
    password: {type: DataTypes.STRING(100), allowNull: false}
});

