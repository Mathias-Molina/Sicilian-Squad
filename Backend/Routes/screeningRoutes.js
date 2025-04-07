// screeningRoutes.js
import express from "express";
import {
  addScreeningsHandler,
  getAllScreeningsHandler,
  getScreeningsByMovieIdHandler,
  getScreeningDetailsHandler,
} from "../Controllers/screeningsController.js";
import isAdmin from "../Middleware/isAdmin.js";
import authMiddleware from "../Middleware/auth.js";

export const screeningRouter = express.Router();

// Hämta alla screeningar
screeningRouter.get("/", getAllScreeningsHandler);

// Hämta screeningdetaljer för en specifik screening
screeningRouter.get("/details/:screeningId", getScreeningDetailsHandler);

// Hämta screeningar baserat på movieId (ex. alla screeningar för en film)
screeningRouter.get("/movie/:movieId", getScreeningsByMovieIdHandler);

// Lägg till en ny screening (kräver admin)
screeningRouter.post("/add", authMiddleware, isAdmin, addScreeningsHandler);
