import { Router } from "express";
import { 
  getAllUsers, getUserById, createUser, updateUser, deleteUser 
} from "../controllers/user.controller.js";
import { createUserValidation } from "../middlewares/user.validation.js";
import { handleValidation } from "../middlewares/validation.handler.js";

const router = Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createUserValidation, handleValidation, createUser);
router.put("/:id", createUserValidation, handleValidation, updateUser);
router.delete("/:id", deleteUser);

export default router;

