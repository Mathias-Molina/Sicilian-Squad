import { apiRequest } from "./apiRequest";

export const getScreenings = (
  movieId,
  errorMessage = "Fel vid hämtning av visningar"
) =>
  apiRequest(
    `http://localhost:3000/screenings/${movieId}`,
    {
      method: "GET",
    },
    errorMessage
  );
