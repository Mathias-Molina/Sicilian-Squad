import {
  addScreenings,
  getAllScreenings,
  getScreeningsByMovieId,
} from "../Models/screeningModel.js";

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

export const getAllScreeningsHandler = (req, res) => {
  try {
    const screenings = getAllScreenings();
 feature/bokningssida
    res.json(screenings);
  } catch (error) {
    console.error("Error retrieving screenings:", error);
=======
    res.send(screenings);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getScreeningsByMovieIdHandler = (req, res) => {
  const { movie_id } = req.params;

  try {
    const screening = getScreeningsByMovieId(Number(movie_id));

    if (screening) {
      res.send(screening);
    } else {
      res.status(404).json({ message: "No screening found" });
    }
  } catch (error) {
> main
    res.status(500).json({ message: "Internal server error" });
  }
};
