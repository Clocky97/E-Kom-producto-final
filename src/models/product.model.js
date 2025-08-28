import { DataTypes, STRING } from "sequelize";
import { sequelize } from "../config/database.js";
import { CategoryModel } from "./category.model.js";

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
        "category_id": {
            type: DataTypes.INTEGER,
            allowNull: false
        }
        
        
    }
)

ProductModel.belongsTo(CategoryModel, { //belongsTo va donde esta la forein key
    as: "categoría",
    foreignKey: "category_id",
});

CategoryModel.hasMany(ProductModel, {
    as: "productos",
    foreignKey: "category_id"
}
);