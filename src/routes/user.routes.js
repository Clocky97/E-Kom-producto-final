import { Router } from "express";
import { register, login, refresh, logout } from "../controllers/auth.controller.js";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/user.controller.js";
import { createUserValidation } from "../middlewares/user.validation.js";
import { handleValidation } from "../middlewares/validation_handler.js";
import { auth, admin } from "../middlewares/auth.middleware.js";

const router = Router();

// Rutas públicas
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

// Rutas protegidas
router.get("/user", auth, getAllUsers);
router.get("/user/:id", auth, getUserById);
router.post("/user/", auth, createUserValidation, handleValidation, createUser);
router.put("/user/:id", auth, createUserValidation, handleValidation, updateUser);
router.delete("/user/:id", auth, admin, deleteUser);

export default router;

