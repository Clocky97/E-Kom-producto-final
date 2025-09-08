import { Router } from "express";
import { getAllPost, getPostById, createPost, updatePost, deletePost } from "../controllers/post.controllers.js";
import { auth, admin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/post", auth, getAllPost);
router.get("/post/:id", auth, getPostById);
router.post("/post", auth, admin, createPost);
router.put("/post/:id", auth, admin, updatePost);
router.delete("/post/:id", auth, admin, deletePost);

export default router;