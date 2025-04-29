import { apiRequest } from "./apiRequest";
export const getAllActors = (
  errorMessage = "Fel vid hämtning av alla skådespelare"
) => apiRequest("http://localhost:3000/actor", {}, errorMessage);

export const GetActorsByMovieId = (
  movieId,
  errorMessage = "Fel vid hämtning av skådespelare"
) => apiRequest(`http://localhost:3000/actor/${movieId}`, {}, errorMessage);

// (valfritt) om du vill ha filmer per skådespelare:
export const getMoviesByActor = (
  movieId,
  actorName,
  errorMessage = "Fel vid hämtning av filmer för skådespelare"
) =>
  apiRequest(
    `/actor/${movieId}/${encodeURIComponent(actorName)}`,
    {},
    errorMessage
  );
