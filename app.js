import express from "express";
import "dotenv/config";
import { startDB } from "./src/config/database.js";
import userRouter from "./src/routes/user.routes.js";
import profileRouter from "./src/routes/profile.routes.js";
import categoryRouter from "./src/routes/category.routes.js";
import postRouter from "./src/routes/post.routes.js";
import ProductRouter from "./src/routes/product.routes.js";
import cookieParser from "cookie-parser";



const app = express();
const PORT = process.env.PORT || 1212;

app.use(express.json());
app.use(cookieParser());

app.use("/ekom", userRouter);
app.use("/ekom", profileRouter);
app.use("/ekom", categoryRouter);
app.use("/ekom", postRouter);
app.use("/ekom", ProductRouter);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    startDB();
});
