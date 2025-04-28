import express from "express";
import {
  getAllActorsHandler,
  getActorsByMovieIdHandler,
} from "../Controllers/actorController.js";

export const actorRouter = express.Router();

actorRouter.get("/", getAllActorsHandler);

actorRouter.get("/:movieId", getActorsByMovieIdHandler);
