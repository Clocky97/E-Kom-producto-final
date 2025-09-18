import { Router } from "express";
import { register, login } from "../controllers/auth.controllers.js";
import { 
  getAllUsers, getUserById, createUser, updateUser, deleteUser 
} from "../controllers/user.controller.js";
import { createUserValidation } from "../middlewares/validations/user.validation.js";
import { handleValidation } from "../middlewares/validation_handler.js";
import { auth, admin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/user", getAllUsers);
router.get("/user/:id", getUserById);
router.post("/user/", auth, createUserValidation, handleValidation, createUser);
router.put("/user/:id", auth, createUserValidation, handleValidation, updateUser);
//login y logout
router.post("/register", register);
router.post("/login", login);
//Solo el admin debe poder eliminar y ver todos los usuarios
router.delete("/user/:id", auth, admin, deleteUser);
//Usuario autenticado puede ver tdos los usuarios
router.get("/user", auth, getAllUsers);

export default router;

