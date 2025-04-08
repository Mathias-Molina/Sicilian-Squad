import { apiRequest } from './apiRequest';

export const getAvailableSeats = (
  screeningId,
  errorMessage = 'Fel vid hämtning av lediga säten'
) =>
  apiRequest(
    `http://localhost:3000/bookings/screening/${screeningId}/seats`,
    {},
    errorMessage
  );

export const getSeatsByBookingId = (
  bookingId,
  errorMessage = 'Fel vid hämtning av bokade platser'
) =>
  apiRequest(
    `http://localhost:3000/bookings/${bookingId}/seats`,
    {},
    errorMessage
  );
