import { apiRequest } from "./apiRequest";

export const getMovies = (errorMessage = "Fel vid hämtning av filmer") =>
  apiRequest("http://localhost:3000/movies", {}, errorMessage);

export const getMovieById = (
  movieId,
  errorMessage = "Fel vid hämtning av film"
) => apiRequest(`http://localhost:3000/movies/${movieId}`, {}, errorMessage);

export const deleteMovie = (
  movieId,
  errorMessage = "Fel vid radering av film"
) =>
  apiRequest(
    `http://localhost:3000/movies/${movieId}`,
    { method: "DELETE" },
    errorMessage
  );
