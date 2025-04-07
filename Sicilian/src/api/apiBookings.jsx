import { apiRequest } from "./apiRequest";

export const createBooking = (bookingData, errorMessage = "Fel vid bokning") =>
  apiRequest(
    "http://localhost:3000/bookings",
    {
      method: "POST",
      body: JSON.stringify(bookingData),
      headers: {
        "Content-Type": "application/json",
      },
    },
    errorMessage
  );
