import { db } from '../Config/database.js';

export const createBooking = (
  booking_number,
  booking_price,
  user_id,
  screening_id
) => {
  const stmt = db.prepare(`
    INSERT INTO bookings (booking_number, booking_price, user_id, screening_id)
    VALUES (?,?,?,?)
  `);
  return stmt.run(booking_number, booking_price, user_id, screening_id);
};

export const createBookingSeat = (
  booking_id,
  seat_id,
  bookingSeat_price,
  ticketType
) => {
  const stmt = db.prepare(`
    INSERT INTO bookingSeats (booking_id, seat_id, bookingSeat_price, bookingSeat_ticketType)
    VALUES (?,?,?,?)
  `);
  return stmt.run(booking_id, seat_id, bookingSeat_price, ticketType);
};

export const getBookingById = booking_id => {
  const stmt = db.prepare('SELECT * FROM bookings WHERE booking_id = ?');
  return stmt.get(booking_id);
};

export const getBookingSeats = booking_id => {
  const stmt = db.prepare('SELECT * FROM bookingSeats WHERE booking_id = ?');
  return stmt.all(booking_id);
};

export const getAllSeatsForSalon = salon_id => {
  const stmt = db.prepare('SELECT * FROM seats WHERE salon_id = ?');
  return stmt.all(salon_id);
};

export const getBookedSeatIdsForScreening = screening_id => {
  const stmt = db.prepare(`
      SELECT bs.seat_id 
      FROM bookingSeats bs
      JOIN bookings b ON bs.booking_id = b.booking_id
      WHERE b.screening_id = ?
    `);
  const rows = stmt.all(screening_id);
  return rows.map(row => row.seat_id);
};

export const getBookingsByUserId = userId => {
  const stmt = db.prepare('SELECT * FROM bookings WHERE user_id = ?');
  return stmt.all(userId);
};

export const getAllBookings = () => {
  const stmt = db.prepare('SELECT * FROM bookings');
  return stmt.all();
};

export const getBookingSeatsWithSeatInfo = booking_id => {
  const stmt = db.prepare(`
    SELECT 
      bs.booking_id,
      bs.seat_id,
      bs.bookingSeat_price,
      bs.bookingSeat_ticketType,
      s.seat_rowNumber,
      s.seat_number
    FROM bookingSeats bs
    JOIN seats s ON bs.seat_id = s.seat_id
    WHERE bs.booking_id = ?
  `);

  return stmt.all(booking_id);
};
