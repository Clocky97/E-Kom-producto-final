import { Router } from "express";
import { getAllPost, getPostById, createPost, updatePost, deletePost } from "../controllers/post.controllers.js";

const router = Router();

router.get("/post", getAllPost);
router.get("/post/:id", getPostById);
router.post("/post", createPost);
router.put("/post/:id", updatePost);
router.delete("/post/:id", deletePost);

export default router;