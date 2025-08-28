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

router.get("/", getAllProfiles);
router.get("/:id", getProfileById);
router.post("/", createProfileValidation, handleValidation, createProfile);
router.put("/:id", createProfileValidation, handleValidation, updateProfile);
router.delete("/:id", deleteProfile);

export default router;
