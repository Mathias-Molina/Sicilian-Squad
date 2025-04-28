import { db } from '../Config/database.js';

const ratingToAge = rated => {
  switch (rated) {
    case 'G':
      return 0; // All ages
    case 'PG':
      return 7; // 7 år
    case 'PG-13':
      return 13; // 13 år
    case 'R':
      return 17; // 17 år
    case 'NC-17':
      return 18; // 18 år
    case 'N/A':
      return 0; // Ingen åldersgräns
    case 'TV-G':
      return 0; // All ages (TV)
    case 'TV-PG':
      return 7; // Föräldrar rekommenderas (TV)
    case 'TV-14':
      return 14; // 14 år (TV)
    case 'TV-MA':
      return 17; // Endast vuxna (17+)
    default:
      return 100; // Default: superhög ålder så vi inte visar okända ratings av misstag
  }
};

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
    'INSERT INTO movies (movie_title, movie_description, movie_genre, movie_rated, movie_poster, movie_trailer, movie_runtime, movie_releaseDate, movie_actors) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
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

export const getAllMovies = (genre = null, age = null) => {
  let query = 'SELECT * FROM movies WHERE movie_isDeleted = 0';
  const params = [];

  if (genre) {
    query += ' AND movie_genre LIKE ?';
    params.push(`%${genre.toLowerCase()}%`);
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
    'SELECT * FROM movies WHERE movie_id = ? AND movie_isDeleted = 0'
  );
  return stmt.get(movieId);
};

export const softDeleteMovie = movieId => {
  const stmt = db.prepare(
    'UPDATE movies SET movie_isDeleted = 1 WHERE movie_id = ?'
  );
  const info = stmt.run(movieId);
  if (info.changes === 0) {
    throw new Error('Filmen hittades inte');
  }
  return info;
};

export const checkIfMovieExist = movie_title => {
  const stmt = db.prepare(
    'SELECT movie_title FROM movies WHERE movie_title = ? '
  );

  const movie = stmt.all(movie_title);

  if (movie.length > 0) {
    return true;
  }
};

export const getAllMoviesIncludingDeleted = () => {
  const stmt = db.prepare('SELECT * FROM movies');
  return stmt.all();
};
