import { Router } from "express";
import { getAllCategory, getCategoryById, createCategory, updateCategory, deleteCategory } from "../controllers/category.controllers.js";

const router = Router();

router.get("/category", getAllCategory);
router.get("/category/:id", getCategoryById);
router.post("/category", createCategory);
router.put("/category/:id", updateCategory);
router.delete("/category/:id", deleteCategory);

export default router;

