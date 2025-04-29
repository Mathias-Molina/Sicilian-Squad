import express from "express";
import {
  getAllMoviesHandler,
  deleteMovieHandler,
  getMovieByIdHandler,
  getGenresHandler,
  getRatingsHandler,
} from "../controllers/movieController.js";

export const movieRouter = express.Router();

movieRouter.get("/", getAllMoviesHandler);
movieRouter.get("/genres", getGenresHandler);
movieRouter.get("/ratings", getRatingsHandler);
movieRouter.get("/:movieId", getMovieByIdHandler);
movieRouter.delete("/:movieId", deleteMovieHandler);
