import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser,currentUser,updatePassword } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

export const userRouter = Router();

// register route 
userRouter.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ])
    , registerUser);

// login route
userRouter.route("/login").post(loginUser);

//! secure route
// logout route 
userRouter.route("/logout").post(verifyJWT, logoutUser);

// refresh Access Token 
userRouter.route("/refresh-token").post(refreshAccessToken);

// get current user 
userRouter.route("/current-user").post(verifyJWT,currentUser);

// change password 
userRouter.route("/update-password").post(verifyJWT,updatePassword);