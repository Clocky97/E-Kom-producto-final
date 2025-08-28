import express from "express";
import dotenv from "dotenv";
import { startDB } from "./src/config/database.js";
//import userRouter from "./src/routes/user.routes.js";
//import profileRouter from "./src/routes/profile.routes.js";
import "../E-Kom-producto-final/src/models/category.model.js"
import "../E-Kom-producto-final/src/models/post.model.js"
import "../E-Kom-producto-final/src/models/product.model.js"
import "../E-Kom-producto-final/src/models/profile.model.js"
import "../E-Kom-producto-final/src/models/user.model.js"

dotenv.config();    

const app = express();
const PORT = process.env.PORT || 1212;

app.use(express.json());

//app.use("/users", userRouter);
//app.use("/profiles", profileRouter);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    startDB();
});
