import express from "express";
import dotenv from "dotenv";
import { startDB } from "./src/config/database.js";
import userRouter from "./src/routes/user.routes.js";
import profileRouter from "./src/routes/profile.routes.js";

dotenv.config();    

const app = express();
const PORT = process.env.PORT || 1212;

app.use(express.json());

app.use("/ekom", userRouter);
app.use("/ekom", profileRouter);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    startDB();
});

export default app;