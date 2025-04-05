bookingModels.js

import { db } from "../Config/database.js";

export const createBooking = (booking_number, booking_price, user_id, screening_id) => {
  const stmt = db.prepare(`
    INSERT INTO bookings (booking_number, booking_price, user_id, screening_id)
    VALUES (?,?,?,?)
  `);
  return stmt.run(booking_number, booking_price, user_id, screening_id);
};

export const createBookingSeat = (booking_id, seat_id, bookingSeat_price, ticketType) => {
  const stmt = db.prepare(`
    INSERT INTO bookingSeats (booking_id, seat_id, bookingSeat_price, bockingSeat_ticketType)
    VALUES (?,?,?,?)
  `);
  return stmt.run(booking_id, seat_id, bookingSeat_price, ticketType);
};
