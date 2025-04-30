import { apiRequest } from "./apiRequest";

export const getMovies = (
  query = "",
  errorMessage = "Fel vid hämtning av filmer"
) => apiRequest(`http://localhost:3000/movies${query}`, {}, errorMessage);

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

export const getMovieByActor = (
  actorName,
  errorMessage = "Fel vid hämtning av film"
) =>
  apiRequest(
    `http://localhost:3000/actors/${movieId}/${actorName}`,
    {},
    errorMessage
  );
  export const getGenres = (
    errorMessage = "Fel vid hämtning av genrer"
  ) => apiRequest(
    "http://localhost:3000/movies/genres",
    {},
    errorMessage
  );
  
  export const getActors = (
    errorMessage = "Fel vid hämtning av skådespelare"
  ) => apiRequest(
    "http://localhost:3000/actor",
    {},
    errorMessage
  );
  
  export const getRatings = (
    errorMessage = "Fel vid hämtning av betyg"
  ) => apiRequest(
    "http://localhost:3000/movies/ratings",
    {},
    errorMessage
  );