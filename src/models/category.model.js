import { sequelize } from "../config/database.js"; 
import { DataTypes } from "sequelize";

export const CategoryModel = sequelize.define(
    "Category", {
        "name": {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
        // "vegan": {
        //     type: DataTypes.BOOLEAN,

        //     defaultValue: false
        // },
        // "dairy": { //lacteos
        //     type: DataTypes.BOOLEAN,
        //     defaultValue: false
        // },
        // "meats": {
        //     type: DataTypes.BOOLEAN,
        //     defaultValue: false
        // },
        // "gluten_free": {
        //     type: DataTypes.BOOLEAN,
        //     defaultValue: false
        // },
        // "bakery_pasta": { //panificados y pastas
        //     type: DataTypes.BOOLEAN,
        //     defaultValue: false
        // },
        // "grocery_canned": { //almacén y conservas
        //     type: DataTypes.BOOLEAN,
        //     defaultValue: false
        // },
        // "fruits_vegetables": {
        //     type: DataTypes.BOOLEAN,
        //     defaultValue: false
        // },
        // "sweets_snacks": {
        //     type: DataTypes.BOOLEAN,
        //     defaultValue: false
        // },
        // "beverages": {
        //     type: DataTypes.BOOLEAN,
        //     defaultValue: false
        // },
        // "frozen": { //congelados, no elsa
        //     type: DataTypes.BOOLEAN,
        //     defaultValue: false
        // },
        // "healthy_diet": {
        //     type: DataTypes.BOOLEAN,
        //     defaultValue: false
        // }
    },
    {
        paranoid: true
    }
)