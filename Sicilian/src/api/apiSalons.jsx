import { apiRequest } from "./apiRequest";

export const getSalons = (errorMessage = "Fel vid hämtning av salonger") =>
  apiRequest("http://localhost:3000/salons", {}, errorMessage);
