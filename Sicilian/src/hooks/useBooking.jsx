import { useState } from "react";
import { createBooking } from "../api/apiBookings";

export const useBooking = () => {
  const [bookingError, setBookingError] = useState("");

  const handleBooking = async ({ screeningId, selectedSeats, totalPrice, ticketTypes }) => {
    try {
      const response = await createBooking({
        screeningId,
        seats: selectedSeats,
        totalPrice,
        ticketTypes,
      });
      setBookingError("Bokning skapad! Bokningsnummer: " + response.bookingNumber);
      return response;
    } catch (err) {
      console.error("Fel vid bokning:", err);
      setBookingError("Något gick fel vid bokningen.");
      return null;
    }
  };

  return { bookingError, handleBooking, setBookingError };
};
