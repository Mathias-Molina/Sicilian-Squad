import express from "express";
import { addScreeningsHandler } from "../Controllers/screeningsController.js";

export const screeningRouter = express.Router();

screeningRouter.post("/add", addScreeningsHandler);
