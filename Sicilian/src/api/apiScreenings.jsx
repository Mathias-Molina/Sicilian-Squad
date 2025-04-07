// apiScreenings.js
import { apiRequest } from "./apiRequest";

export const getScreenings = (
  movieId,
  errorMessage = "Fel vid hämtning av visningar"
) =>
  apiRequest(
    `http://localhost:3000/screenings/movie/${movieId}`,
    {
      method: "GET",
    },
    errorMessage
  );

export const getScreeningDetails = (
  screeningId,
  errorMessage = "Fel vid hämtning av screeningdetaljer"
) =>
  apiRequest(
    `http://localhost:3000/screenings/details/${screeningId}`,
    {},
    errorMessage
  );
