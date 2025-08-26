import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { registerUser, loginUser, logoutUser, checkUserAuth, uploadAvatar, deleteUserCompletely } from "../controllers/user.controller.js";

const authUser = Router();

authUser.route("/register").post(upload.none(), registerUser);

authUser.route("/login").post(upload.none(), loginUser);

authUser.route("/logout").post(verifyJWT, logoutUser);

authUser.route("/upload-avatar").put(verifyJWT, upload.single("avatar"), uploadAvatar);

authUser.route("/checkAuth").get(verifyJWT, checkUserAuth);

authUser.route("/deleteUser").delete(verifyJWT, deleteUserCompletely);

// --- Export Routes ---

export { authUser };