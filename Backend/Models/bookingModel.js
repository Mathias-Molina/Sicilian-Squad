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

export const getDetailedBookingsByUserId = userId => {
  const stmt = db.prepare(`
    SELECT 
      b.booking_id,
      b.booking_number,
      b.user_id,
      s.screening_time,
      m.movie_title,
      m.movie_poster,
      sal.salon_name,
      COUNT(bs.bookingseat_id) AS number_of_tickets
    FROM bookings b
    JOIN screenings s ON b.screening_id = s.screening_id
    JOIN movies m ON s.movie_id = m.movie_id
    JOIN salons sal ON s.salon_id = sal.salon_id
    JOIN bookingseats bs ON bs.booking_id = b.booking_id
    WHERE b.user_id = ?
    GROUP BY b.booking_id
    ORDER BY s.screening_time DESC
  `);

  return stmt.all(userId);
};

export const getBookingByNumber = bookingNumber => {
  const stmt = db.prepare('SELECT * FROM bookings WHERE booking_number = ?');
  return stmt.get(bookingNumber);
};
