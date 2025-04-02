import express from "express";
import { loginUser } from "../Controllers/userController.js";

export const userRouter = express.Router();

userRouter.post("/login", loginUser);
