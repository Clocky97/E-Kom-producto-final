import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";
import { ProductModel } from "./product.model.js";
import  User  from "./user.model.js";

const PostModel = sequelize.define(
    "post", {
        "titulo": {
            type: DataTypes.STRING,
            allowNull: false
        },
        "content": {  //contenido del posteo
            type: DataTypes.TEXT, 
            allowNull: false
        },
        "offer": {
            type: DataTypes.ENUM("estandar", "oferta"),
            defaultValue: "estandar"
        },
        "user_id": {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }
)

export default PostModel;