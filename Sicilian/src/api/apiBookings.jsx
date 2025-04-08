import { apiRequest } from './apiRequest';

export const getAllBookings = (errorMessage = 'Fel vid hitta alla bokningar') =>
  apiRequest('http://localhost:3000/bookings/admin', {}, errorMessage);

export const getBookingsByUserId = (userId, errorMessage = 'Fel vid hitta bokningar') =>
  apiRequest(`http://localhost:3000/bookings/user/${userId}`, {}, errorMessage);

export const createBooking = (bookingData, errorMessage = 'Fel vid bokning') =>
  apiRequest(
    'http://localhost:3000/bookings',
    {
      method: 'POST',
      body: JSON.stringify(bookingData),
      headers: {
        'Content-Type': 'application/json',
      },
    },
    errorMessage
  );
