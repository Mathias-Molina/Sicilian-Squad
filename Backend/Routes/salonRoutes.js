import express from "express";
import {
  getAllSalonsHandler,
  getSalonByIdHandler,
} from "../controllers/salonController.js";

export const salonRouter = express.Router();

salonRouter.get("/", getAllSalonsHandler);
salonRouter.get("/:salonId", getSalonByIdHandler);
