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

export const addScreenings = (
  movie_id,
  salon_id,
  screening_time,
  errorMessage = "Gick inte att lägga till visning"
) =>
  apiRequest(
    `http://localhost:3000/screenings/add`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        movie_id: Number(movie_id),
        salon_id: Number(salon_id),
        screening_time,
      }),
    },
    errorMessage
  );
