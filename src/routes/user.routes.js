import user from "../models/user.model.js";
import router from "express";
import {
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getAllUsers
} from "../controllers/user.controller.js";

const userRouter = router.Router();

userRouter.get("/:id", getUserById);
userRouter.post("/", createUser);
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);
userRouter.get("/", getAllUsers);

export default userRouter;