import { Router } from "express";
import {
  getAllProfiles,
  getProfileById,
  createProfile,
  updateProfile,
  deleteProfile,
} from "../controllers/profile.controller.js";
import { createProfileValidation } from "../middlewares/profile.validation.js";
import { handleValidation } from "../middlewares/validation.handler.js";

const router = Router();

router.get("/profile", getAllProfiles);
router.get("/profile/:id", getProfileById);
router.post("/profile", createProfileValidation, handleValidation, createProfile);
router.put("/profile/:id", createProfileValidation, handleValidation, updateProfile);
router.delete("/profile/:id", deleteProfile);

export default router;
