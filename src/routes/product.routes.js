import { Router } from "express";
import { getAllProduct, getProductById, createProduct, updateProduct, deleteProduct } from "../controllers/product.controllers.js";

const router = Router();

router.get("/product", getAllProduct);
router.get("/product/:id", getProductById);
router.post("/product", createProduct);
router.put("/product/:id", updateProduct);
router.delete("/product/:id", deleteProduct);

export default router;