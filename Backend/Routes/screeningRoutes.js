import express from "express";
 feature/bokningssida
import { addScreeningsHandler, getAllScreeningsHandler } from "../Controllers/screeningsController.js";
=======
import {
  addScreeningsHandler,
  getAllScreeningsHandler,
  getScreeningsByMovieIdHandler,
} from "../Controllers/screeningsController.js";
import isAdmin from "../Middleware/isAdmin.js";
import authMiddleware from "../Middleware/auth.js";
 main

export const screeningRouter = express.Router();

screeningRouter.get("/", authMiddleware, isAdmin, getAllScreeningsHandler);
screeningRouter.get(
  "/:movie_id",
  authMiddleware,
  isAdmin,
  getScreeningsByMovieIdHandler
);
screeningRouter.post("/add", addScreeningsHandler);

screeningRouter.get("/", getAllScreeningsHandler);