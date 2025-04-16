import { db } from '../Config/database.js';
import {
  createBooking,
  createBookingSeat,
  getBookingsByUserId,
  getBookingById,
  getBookingSeats,
  getBookedSeatIdsForScreening,
  getAllBookings,
  getDetailedBookingsByUserId,
  getBookingByNumber,
  getBookingSeatsWithSeatInfo,
} from '../Models/bookingModel.js';

export const createBookingHandler = (req, res) => {
  const { screeningId, seats, totalPrice, ticketTypes } = req.body;

  if (!screeningId || !seats || seats.length === 0) {
    return res
      .status(400)
      .json({ message: 'screeningId och minst ett säte måste anges' });
  }

  const bookingNumber = Math.random().toString(36).substring(2, 9);
  const userId = req.user ? req.user.id : null;

  try {
    // Hämta screeningens baspris från databasen
    const screeningStmt = db.prepare(
      'SELECT screening_price FROM screenings WHERE screening_id = ?'
    );
    const screening = screeningStmt.get(screeningId);
    if (!screening) {
      return res.status(404).json({ message: 'Screening hittades inte' });
    }
    const basePrice = screening.screening_price;

    // Skapa bokningen med det totala priset (du kan även välja att beräkna totalPrice här om du vill)
    const result = createBooking(
      bookingNumber,
      totalPrice,
      userId,
      screeningId
    );
    const bookingId = result.lastInsertRowid;

    // Funktion för att få multiplikator baserat på vald biljett-typ
    const getMultiplier = ticketType => {
      if (ticketType === 'barn') return 0.5;
      if (ticketType === 'student') return 0.8;
      return 1.0; // vuxen
    };

    // Loopa igenom de bokade sätena och beräkna individuellt pris per biljett
    for (let i = 0; i < seats.length; i++) {
      const seatId = seats[i];
      const ticketType = ticketTypes[i] || 'vuxen';
      const multiplier = getMultiplier(ticketType);
      const seatPrice = basePrice * multiplier;
      createBookingSeat(bookingId, seatId, seatPrice, ticketType);
    }

    res.json({ message: 'Bokning skapad', bookingNumber, bookingId });
  } catch (error) {
    console.error('Fel vid skapande av bokning:', error);
    res.status(500).json({ message: 'Fel vid skapande av bokning' });
  }
};

export const getBookingHandler = (req, res) => {
  const { bookingId } = req.params;

  try {
    // Hämta bokningsinformationen med modellfunktionen
    const booking = getBookingById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Bokningen hittades inte' });
    }
    // Hämta tillhörande bokade säten med modellfunktionen
    const seats = getBookingSeats(bookingId);
    res.json({ booking, seats });
  } catch (error) {
    console.error('Fel vid hämtning av bokning:', error);
    res.status(500).json({ message: 'Fel vid hämtning av bokning' });
  }
};

export const getAvailableSeatsHandler = (req, res) => {
  const { screeningId } = req.params;

  try {
    // Hämta screening för att avgöra vilken salong som används
    const screeningStmt = db.prepare(
      'SELECT * FROM screenings WHERE screening_id = ?'
    );
    const screening = screeningStmt.get(screeningId);
    if (!screening) {
      return res.status(404).json({ message: 'Screening hittades inte' });
    }

    // Hämta alla säten för salongen
    const seatsStmt = db.prepare('SELECT * FROM seats WHERE salon_id = ?');
    const allSeats = seatsStmt.all(screening.salon_id);

    // Hämta redan bokade säten via modellfunktionen
    const bookedSeatIds = getBookedSeatIdsForScreening(screeningId);

    // Lägg till en flagga "available" för varje säte
    const seatsWithAvailability = allSeats.map(seat => ({
      ...seat,
      available: !bookedSeatIds.includes(seat.seat_id),
    }));

    res.json(seatsWithAvailability);
  } catch (error) {
    console.error('Fel vid hämtning av lediga säten:', error);
    res.status(500).json({ message: 'Fel vid hämtning av lediga säten' });
  }
};

export const getUserBookingsHandler = (req, res) => {
  const userId = Number(req.params.userId);
  res.set('Cache-Control', 'no-store');

  try {
    // Gör en JOIN med screenings-tabellen för att få tillgång till screening_time
    const query = `
      SELECT b.*, s.screening_time
      FROM bookings b
      INNER JOIN screenings s ON b.screening_id = s.screening_id
      WHERE b.user_id = ?
    `;
    const stmt = db.prepare(query);
    const bookings = stmt.all(userId);

    // Hämta nuvarande tid
    const now = new Date();

    // Dela in bokningarna efter om screening_time är i framtiden eller förfluten
    const upcomingBookings = bookings.filter(
      booking => new Date(booking.screening_time) >= now
    );
    const pastBookings = bookings.filter(
      booking => new Date(booking.screening_time) < now
    );

    res.json({ upcomingBookings, pastBookings });
  } catch (error) {
    console.error('Error retrieving bookings for user:', error);
    res.status(500).json({ message: 'Error retrieving bookings' });
  }
};

export const getAllBookingsHandler = (req, res) => {
  try {
    const bookings = getAllBookings();
    res.json(bookings);
  } catch (error) {
    console.error('Error retrieving all bookings:', error);
    res.status(500).json({ message: 'Error retrieving all bookings' });
  }
};

export const getDetailedUserBookingsHandler = (req, res) => {
  const userId = Number(req.params.userId);
  res.set('Cache-Control', 'no-store');

  try {
    const bookings = getDetailedBookingsByUserId(userId);

    const now = new Date();

    const upcomingBookings = bookings.filter(
      booking => new Date(booking.screening_time) >= now
    );
    const pastBookings = bookings.filter(
      booking => new Date(booking.screening_time) < now
    );

    res.json({ upcomingBookings, pastBookings });
  } catch (error) {
    console.error('Error retrieving detailed bookings for user:', error);
    res.status(500).json({ message: 'Error retrieving detailed bookings' });
  }
};

export const getBookingByNumberHandler = (req, res) => {
  const { bookingNumber } = req.params;

  try {
    const booking = getBookingByNumber(bookingNumber);
    if (!booking) return res.status(404).json({ message: 'Bokning ej hittad' });

    const seats = getBookingSeatsWithSeatInfo(booking.booking_id);
    res.json({ booking, seats });
  } catch (error) {
    console.error('Fel vid hämtning av bokning med nummer:', error);
    res.status(500).json({ message: 'Något gick fel' });
  }
};
