import router from "express";
import {
  getProfileByUserId,
  createProfile,
  updateProfile,
  deleteProfile,
  getAllProfiles,
} from "../controllers/profile.controller.js";

const profileRouter = router.Router();

profileRouter.get("/:userId", getProfileByUserId);
profileRouter.post("/", createProfile); 
profileRouter.put("/:userId", updateProfile);
profileRouter.delete("/:userId", deleteProfile);
profileRouter.get("/", getAllProfiles);

export default profileRouter;
