import express from "express";
import {
  createBookingHandler,
  getBookingHandler
} from "../Controllers/bookingController.js";

import { authMiddleware } from "../Middlewares/auth.js";
import { isAdmin } from "../Middlewares/admin.js";

export const bookingRouter = express.Router();

bookingRouter.post("/", authMiddleware, createBookingHandler);


bookingRouter.get("/:bookingId", authMiddleware, getBookingHandler);