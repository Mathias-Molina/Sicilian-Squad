import express from "express";
import {
  getAllActorsHandler,
  getActorsByMovieIdHandler,
  getMoviesByActorHandler,
} from "../Controllers/actorController.js";

export const actorRouter = express.Router();

actorRouter.get("/", getAllActorsHandler);

actorRouter.get("/:movieId", getActorsByMovieIdHandler);

actorRouter.get("/:movieId/:actorName", getMoviesByActorHandler);
