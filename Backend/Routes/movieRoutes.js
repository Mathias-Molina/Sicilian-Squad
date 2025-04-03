import express from "express";
import { getAllMoviesHandler, deleteMovieHandler, getMovieByIdHandler } from "../controllers/movieController.js";

export const movieRouter = express.Router();

movieRouter.get("/", getAllMoviesHandler);
movieRouter.get("/:movieId", getMovieByIdHandler);
movieRouter.delete("/:movieId", deleteMovieHandler);

