import { db } from "../Config/database.js";
import { ratingToAge } from "../ratingToAge.js";

export const insertMovie = (
  title,
  description,
  genre,
  rated,
  poster,
  trailer,
  runtime,
  releaseDate,
  actors
) => {
  const stmt = db.prepare(
    "INSERT INTO movies (movie_title, movie_description, movie_genre, movie_rated, movie_poster, movie_trailer, movie_runtime, movie_releaseDate, movie_actors) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  );
  return stmt.run(
    title,
    description,
    genre,
    rated,
    poster,
    trailer,
    runtime,
    releaseDate,
    actors
  );
};

export const getAllMovies = (genre = null, age = null, actor = null) => {
  let query = "SELECT * FROM movies WHERE movie_isDeleted = 0";
  const params = [];

  if (genre) {
    query += " AND movie_genre LIKE ?";
    params.push(`%${genre.toLowerCase()}%`);
  }

  if (actor) {
    query += " AND movie_actors LIKE ?";
    params.push(`%${actor.toLowerCase()}%`);
  }

  const stmt = db.prepare(query);
  let movies = stmt.all(...params);

  if (age !== null) {
    movies = movies.filter(movie => {
      const movieAge = ratingToAge(movie.movie_rated);
      return movieAge <= age;
    });
  }

  return movies;
};

export const getMovieById = movieId => {
  const stmt = db.prepare(
    "SELECT * FROM movies WHERE movie_id = ? AND movie_isDeleted = 0"
  );
  return stmt.get(movieId);
};

export const softDeleteMovie = movieId => {
  const stmt = db.prepare(
    "UPDATE movies SET movie_isDeleted = 1 WHERE movie_id = ?"
  );
  const info = stmt.run(movieId);
  if (info.changes === 0) {
    throw new Error("Filmen hittades inte");
  }
  return info;
};

export const checkIfMovieExist = movie_title => {
  const stmt = db.prepare(
    "SELECT movie_title FROM movies WHERE movie_title = ? "
  );

  const movie = stmt.all(movie_title);

  if (movie.length > 0) {
    return true;
  }
};

export const getAllMoviesIncludingDeleted = () => {
  const stmt = db.prepare("SELECT * FROM movies");
  return stmt.all();
};

export const getAllRatings = () => {
  const rows = db
    .prepare(
      "SELECT DISTINCT movie_rated FROM movies WHERE movie_isDeleted = 0"
    )
    .all();
  return rows
    .map(r => r.movie_rated)
    .filter(r => r)
    .sort();
};

export const getAllGenres = () => {
  const rows = db
    .prepare("SELECT movie_genre FROM movies WHERE movie_isDeleted = 0")
    .all();
  const set = new Set();
  rows.forEach(r => {
    r.movie_genre.split(",").forEach(g => set.add(g.trim()));
  });
  return [...set].sort();
};
