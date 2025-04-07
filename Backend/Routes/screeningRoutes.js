import express from "express";
 feature/bokningssida
import { addScreeningsHandler, getAllScreeningsHandler } from "../Controllers/screeningsController.js";
=======
import {
  addScreeningsHandler,
  getAllScreeningsHandler,
  getScreeningByIdHandler,
} from "../Controllers/screeningsController.js";
import isAdmin from "../Middleware/isAdmin.js";
import authMiddleware from "../Middleware/auth.js";
 main

export const screeningRouter = express.Router();

screeningRouter.get("/", authMiddleware, isAdmin, getAllScreeningsHandler);
screeningRouter.get("/:id", authMiddleware, isAdmin, getScreeningByIdHandler);
screeningRouter.post("/add", addScreeningsHandler);

screeningRouter.get("/", getAllScreeningsHandler);