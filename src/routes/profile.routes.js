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

router.get("/profiles", getAllProfiles);
router.get("/profiles/:id", getProfileById);
router.post("/profiles", createProfileValidation, handleValidation, createProfile);
router.put("/profiles/:id", createProfileValidation, handleValidation, updateProfile);
router.delete("/profiles/:id", deleteProfile);

export default router;
