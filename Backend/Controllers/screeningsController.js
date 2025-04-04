import { addScreenings } from "../Models/screeningModel.js";

export const addScreeningsHandler = (req, res) => {
  const { movie_id, salon_id, screening_time } = req.body;

  if (!movie_id || !salon_id || !screening_time) {
    return res.status(400).send("All fields required");
  }

  try {
    const screening = addScreenings(movie_id, salon_id, screening_time);

    if (screening) {
      res.json({ message: "New screening added" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
