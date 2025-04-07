import { apiRequest } from "./apiRequest";

export const getScreenings = (errorMessage = "Fel vid hämtning av visningar") =>
  apiRequest(
    "http://localhost:3000/screenings",
    { credentials: "include" },
    errorMessage
  );
