import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getMovieHandler } from "./controllers/movieController.js";
import { movieRouter } from "./Routes/movieRoutes.js";

dotenv.config();

const app = express();
app.use(cors());


app.use("/movies", movieRouter);

app.get("/add/:movieName", getMovieHandler);

app.listen(3000, () => {
  console.log("Servern lyssnar på port 3000");
});
