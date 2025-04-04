import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { getMovieHandler } from "./controllers/movieController.js";
import { movieRouter } from "./Routes/movieRoutes.js";
import { userRouter } from "./Routes/userRoutes.js";
import { screeningRouter } from "./Routes/screeningRoutes.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5174", "http://localhost:5173"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/movies", movieRouter);

app.get("/add/:movieName", getMovieHandler);

app.use("/user", userRouter);

app.use("/screenings", screeningRouter);

app.listen(3000, () => {
  console.log("Servern lyssnar på port 3000");
});
