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
