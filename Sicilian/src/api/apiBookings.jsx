import { apiRequest } from './apiRequest';

export const getBookingsByUserId = (errorMessage = 'Fel vid hitta bokningar') =>
  apiRequest(`http://localhost:3000/bookings/user/${userId}`, {}, errorMessage);
