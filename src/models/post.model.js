import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";
import { ProductModel } from "./product.model.js";
import { User } from "./user.model.js";

export const PostModel = sequelize.define(
    "post", {
        "titulo": {
            type: DataTypes.STRING,
            allowNull: false
        },
        "content": {  //contenido del posteo
            type: DataTypes.TEXT, 
            allowNull: false
        },
        "user_id": {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }
)

PostModel.belongsTo(ProductModel, {
    as: "producto",
    foreignKey: "product_id"
})

ProductModel.hasMany(PostModel, {
    as: "publicaciones",
    foreignKey: "product_id"
})

PostModel.belongsTo(User, {
    as: "usuario",
    foreignKey: "user_id"
})

User.hasMany(PostModel, {
    as: "publicaciones",
    foreignKey: "user_id"
})