import express from "express";
import { addScreeningsHandler, getAllScreeningsHandler } from "../Controllers/screeningsController.js";

export const screeningRouter = express.Router();

screeningRouter.post("/add", addScreeningsHandler);

screeningRouter.get("/", getAllScreeningsHandler);