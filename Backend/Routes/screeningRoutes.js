import express from "express";
import {
  addScreeningsHandler,
  getAllScreeningsHandler,
  getScreeningsByMovieIdHandler,
} from "../Controllers/screeningsController.js";
import isAdmin from "../Middleware/isAdmin.js";
import authMiddleware from "../Middleware/auth.js";

export const screeningRouter = express.Router();

screeningRouter.get("/", authMiddleware, isAdmin, getAllScreeningsHandler);
screeningRouter.get(
  "/:movie_id",
  authMiddleware,
  isAdmin,
  getScreeningsByMovieIdHandler
);
screeningRouter.post("/add", addScreeningsHandler);
