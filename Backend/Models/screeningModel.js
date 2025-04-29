import { db } from "../Config/database.js";

export const addScreenings = (
  movie_id,
  salon_id,
  screening_time,
  screening_price
) => {
  try {
    const stmt = db.prepare(
      "INSERT INTO screenings (movie_id, salon_id, screening_time, screening_price) VALUES (?,?,?,?)"
    );

    const screening = stmt.run(
      movie_id,
      salon_id,
      screening_time,
      screening_price
    );
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

export const getScreeningsByMovieId = movie_id => {
  try {
    const stmt = db.prepare(`SELECT *
FROM screenings AS S
INNER JOIN movies AS M ON S.movie_id = M.movie_id
INNER JOIN salons AS SA ON S.salon_id = SA.salon_id
WHERE M.movie_id = ?`);
    const screening = stmt.all(movie_id);
    return screening;
  } catch (error) {
    console.error("Databse query error:", error);
    throw new Error("No screening found");
  }
};

export const getScreeningsByDate = date => {
  const start = `${date} 00:00:00`;
  const end = `${date} 23:59:59`;
  const stmt = db.prepare(`
    SELECT 
      s.screening_id,
      s.screening_time,
      s.salon_id,
      m.movie_title,
      m.movie_poster,
      s.screening_price
    FROM screenings s
    JOIN movies    m ON m.movie_id = s.movie_id
    WHERE s.screening_time BETWEEN ? AND ?
      AND m.movie_isDeleted = 0
    ORDER BY s.salon_id, s.screening_time
  `);
  return stmt.all(start, end);
};
