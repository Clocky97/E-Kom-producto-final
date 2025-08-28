import { Router } from "express";
import { 
  getAllUsers, getUserById, createUser, updateUser, deleteUser 
} from "../controllers/user.controller.js";
import { createUserValidation } from "../middlewares/user.validation.js";
import { handleValidation } from "../middlewares/validation.handler.js";

const router = Router();

router.get("/user", getAllUsers);
router.get("/user/:id", getUserById);
router.post("/user", createUserValidation, handleValidation, createUser);
router.put("/user/:id", createUserValidation, handleValidation, updateUser);
router.delete("/user/:id", deleteUser);

export default router;

