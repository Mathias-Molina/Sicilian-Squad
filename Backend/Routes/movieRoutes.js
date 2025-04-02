import express from "express";
import { getAllMoviesHandler } from "../controllers/movieController.js";

export const movieRouter = express.Router();

movieRouter.get("/", getAllMoviesHandler);
