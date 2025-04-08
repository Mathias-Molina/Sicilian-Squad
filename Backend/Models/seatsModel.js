import { db } from '../Config/database.js';

export const getSeatsByBookingId = bookingId => {
  const stmt = db.prepare(`
    SELECT 
      booking_id,
      seat_id,
      bookingSeat_price,
      bockingSeat_ticketType AS bookingSeat_ticketType,
      bookingSeat_id
    FROM bookingSeats
    WHERE booking_id = ?
  `);

  return stmt.all(bookingId);
};
