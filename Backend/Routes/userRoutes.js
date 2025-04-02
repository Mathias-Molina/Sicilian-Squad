import express from "express";
import { loginUser, registerUser } from "../Controllers/userController.js";

export const userRouter = express.Router();

userRouter.post("/login", loginUser);
userRouter.post("/register", registerUser);
