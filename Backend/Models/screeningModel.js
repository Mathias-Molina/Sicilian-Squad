import { db } from "../Config/database.js";

export const addScreenings = (movie_id, salon_id, screening_time) => {
  try {
    const stmt = db.prepare(
      "INSERT INTO screenings (movie_id, salon_id, screening_time) VALUES (?,?,?)"
    );

    const screening = stmt.run(movie_id, salon_id, screening_time);
    return screening || null;
  } catch (error) {
    console.error("Database query error:", error);
    throw new Error("Failed to add screening in database");
  }
};

export const getAllScreenings = () => {
  try {
    const stmt = db.prepare("SELECT * FROM screenings");
    const screenings = stmt.all();
    return screenings || null;
  } catch (error) {
    console.error("Databse query error:", error);
    throw new Error("Failed to get all screenings");
  }
};

export const getScreeningsByMovieId = (movie_id) => {
  try {
    const stmt = db.prepare("SELECT * FROM screenings WHERE movie_id = ?");
    const screening = stmt.all(movie_id);
    return screening;
  } catch (error) {
    console.error("Databse query error:", error);
    throw new Error("No screening found");
  }
};
