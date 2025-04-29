import { db } from "../Config/database.js";
import {
  addScreenings,
  getAllScreenings,
  getScreeningsByMovieId,
  getScreeningsByDate,
} from "../Models/screeningModel.js";

export const addScreeningsHandler = (req, res) => {
  const { movie_id, salon_id, screening_time, screening_price } = req.body;

  if (!movie_id || !salon_id || !screening_time || !screening_price) {
    return res.status(400).send("All fields required");
  }

  try {
    const screening = addScreenings(
      movie_id,
      salon_id,
      screening_time,
      screening_price
    );

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

    if (!screenings) {
      res.status(404).json({ message: "No screenings found" });
    }

    res.json(screenings);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getScreeningsByMovieIdHandler = (req, res) => {
  // Ändra från movie_id till movieId
  const { movieId } = req.params;
  try {
    const screenings = getScreeningsByMovieId(Number(movieId));
    // Kontrollera att du får en array
    if (screenings && Array.isArray(screenings) && screenings.length > 0) {
      res.send(screenings);
    } else {
      res.status(404).json({ message: "No screenings found" });
    }
  } catch (error) {
    console.error("Error fetching screenings by movieId:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getScreeningDetailsHandler = (req, res) => {
  const { screeningId } = req.params;
  try {
    const stmt = db.prepare(`
      SELECT s.*, m.movie_title
      FROM screenings s 
      JOIN movies m ON s.movie_id = m.movie_id
      WHERE s.screening_id = ?
    `);
    const screening = stmt.get(screeningId);
    if (!screening) {
      return res.status(404).json({ message: "Screening hittades inte" });
    }
    res.json(screening);
  } catch (error) {
    console.error("Fel vid hämtning av screening:", error);
    res.status(500).json({ message: "Fel vid hämtning av screening" });
  }
};

export const getScreeningsByDateHandler = (req, res) => {
  try {
    // Om ?date=YYYY-MM-DD är satt, hämta per datum
    if (req.query.date) {
      const screenings = getScreeningsByDate(req.query.date);
      return res.json(screenings);
    }
    const all = getAllScreenings();
    return res.json(all);
  } catch (e) {
    console.error("Fel vid hämtning av visningar:", e);
    res.status(500).json({ error: "Något gick fel" });
  }
};
