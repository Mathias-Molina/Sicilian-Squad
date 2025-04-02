import express from "express";
import {
  getAllMoviesHandler,
  deleteMovieHandler,
} from "../controllers/movieController.js";

export const movieRouter = express.Router();

movieRouter.get("/", getAllMoviesHandler);
movieRouter.delete("/:id", deleteMovieHandler);
