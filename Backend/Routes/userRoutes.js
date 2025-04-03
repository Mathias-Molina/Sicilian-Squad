import express from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  whoAmI,
} from "../Controllers/userController.js";

export const userRouter = express.Router();

userRouter.get("/whoami", whoAmI);
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
