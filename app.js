
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { startDB } from "./src/config/database.js";
import userRouter from "./src/routes/user.routes.js";
import profileRouter from "./src/routes/profile.routes.js";
import categoryRouter from "./src/routes/category.routes.js";
import postRouter from "./src/routes/post.routes.js";
import ProductRouter from "./src/routes/product.routes.js";


dotenv.config();    

const app = express();
const PORT = process.env.PORT || 1212;

// Habilitar CORS para el frontend
app.use(cors({
    origin: "http://127.0.0.1:5500",
    credentials: true
}));

app.use(express.json());

app.use("/ekom", userRouter);
app.use("/ekom", profileRouter);
app.use("/ekom", categoryRouter);
app.use("/ekom", postRouter);
app.use("/ekom", ProductRouter);

app.listen(PORT, async () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    await startDB();
});
