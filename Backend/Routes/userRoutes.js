import express from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
} from "../Controllers/userController.js";

export const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
