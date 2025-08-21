import { DataTypes, STRING } from "sequelize";
import { sequelize } from "../config/database.js";

export const ProductModel = sequelize.define(
    "product",{
        "product_name": {
            type: DataTypes.STRING,
            allowNull: false
        },
        "price": {
            type: DataTypes.REAL,
            allowNull: false
        },
        "brand": {
            type: DataTypes.STRING,
            allowNull: false
        },
        "image": {
            type: DataTypes.STRING,
            allowNull: false
        },
        "is_vegan": {
            type: DataTypes.BOOLEAN,

            
            defaultValue: false
        },
        "dairy": { //lacteos
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        "meats": {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        "gluten_free": {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        "bakery_pasta": { //panificados y pastas
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        "grocery_canned": { //almacén y conservas
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        "fruits_vegetables": {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        "sweets_snacks": {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        "beverages": {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        "frozen": { //congelados, no elsa
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        "healthy_diet": {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }
)