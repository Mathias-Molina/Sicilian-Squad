import { db } from "../Config/database.js";

export const insertMovie = (
  title,
  description,
  genre,
  rated,
  poster,
  trailer,
  runtime,
  releaseDate
) => {
  const stmt = db.prepare(
    "INSERT INTO movies (movie_title, movie_description, movie_genre, movie_rated, movie_poster, movie_trailer, movie_runtime, movie_releaseDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  );
  return stmt.run(
    title,
    description,
    genre,
    rated,
    poster,
    trailer,
    runtime,
    releaseDate
  );
};

export const getAllMovies = () => {
  const stmt = db.prepare("SELECT * FROM movies");
  return stmt.all();
};

export const getMovieById = (movieId) => {
  const stmt = db.prepare("SELECT * FROM movies WHERE movie_id = ?");
  return stmt.get(movieId);
}

export const deleteMovie = (movieId) => {
  try {
    const stmt = db.prepare("DELETE FROM movies WHERE movie_id = ?");
    const info = stmt.run(movieId);
    if (info.changes === 0) {
      throw new Error("Filmen hittades inte");
    }
    return info;
  } catch (error) {
    throw error;
  }
};