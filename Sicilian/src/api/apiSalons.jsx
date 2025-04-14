import { apiRequest } from "./apiRequest";

export const getSalons = (errorMessage = "Fel vid hämtning av salonger") =>
  apiRequest("http://localhost:3000/salons", {}, errorMessage);

export const getSalonById = (
  salonId,
  errorMessage = "Fel vid hämtning av salong"
) => apiRequest(`http://localhost:3000/salons/${salonId}`, {}, errorMessage);
