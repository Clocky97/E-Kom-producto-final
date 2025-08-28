import { Router } from "express";
import { 
  getAllUsers, getUserById, createUser, updateUser, deleteUser 
} from "../controllers/user.controller.js";
import { createUserValidation } from "../middlewares/user.validation.js";
import { handleValidation } from "../middlewares/validation.handler.js";

const router = Router();

router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUserValidation, handleValidation, createUser);
router.put("/users/:id", createUserValidation, handleValidation, updateUser);
router.delete("/users/:id", deleteUser);

export default router;

