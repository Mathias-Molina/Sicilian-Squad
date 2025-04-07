import express from "express";
import {
  addScreeningsHandler,
  getAllScreeningsHandler,
  getScreeningsByMovieIdHandler,
} from "../Controllers/screeningsController.js";
import isAdmin from "../Middleware/isAdmin.js";
import authMiddleware from "../Middleware/auth.js";

export const screeningRouter = express.Router();

screeningRouter.get("/", getAllScreeningsHandler);
screeningRouter.get("/:movie_id", getScreeningsByMovieIdHandler);
screeningRouter.post("/add", authMiddleware, isAdmin, addScreeningsHandler);

screeningRouter.get("/", getAllScreeningsHandler);
