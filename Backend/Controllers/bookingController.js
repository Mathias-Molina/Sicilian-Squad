import { db } from "../Config/database.js";
import {
  createBooking,
  createBookingSeat,
  getBookingsByUserId,
  getBookingById,
  getBookingSeats,
  getBookedSeatIdsForScreening,
  getAllBookings,
} from "../Models/bookingModel.js";

export const createBookingHandler = (req, res) => {
  const { screeningId, seats, totalPrice, ticketTypes } = req.body;
  // Förväntar att "seats" är en array med seat_id och "ticketTypes" innehåller typ (t.ex. vuxen, barn) för varje vald plats

  if (!screeningId || !seats || seats.length === 0) {
    return res
      .status(400)
      .json({ message: "screeningId och minst ett säte måste anges" });
  }

  // Skapa ett slumpmässigt bokningsnummer (kan bytas ut mot en annan logik)
  const bookingNumber = Math.random().toString(36).substr(2, 9);
  const userId = req.user.id; // Hämtas från auth-middleware

  try {
    // Använd modellfunktionen för att skapa bokningen
    const result = createBooking(
      bookingNumber,
      totalPrice,
      userId,
      screeningId
    );
    const bookingId = result.lastInsertRowid;

    // Infoga varje valt säte via modellfunktionen
    for (let i = 0; i < seats.length; i++) {
      const seatId = seats[i];
      const ticketType = ticketTypes[i] || "vuxen"; // Standardvärde
      createBookingSeat(
        bookingId,
        seatId,
        totalPrice / seats.length,
        ticketType
      );
    }

    res.json({ message: "Bokning skapad", bookingNumber, bookingId });
  } catch (error) {
    console.error("Fel vid skapande av bokning:", error);
    res.status(500).json({ message: "Fel vid skapande av bokning" });
  }
};

export const getBookingHandler = (req, res) => {
  const { bookingId } = req.params;

  try {
    // Hämta bokningsinformationen med modellfunktionen
    const booking = getBookingById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Bokningen hittades inte" });
    }

    // Hämta tillhörande bokade säten med modellfunktionen
    const seats = getBookingSeats(bookingId);

    res.json({ booking, seats });
  } catch (error) {
    console.error("Fel vid hämtning av bokning:", error);
    res.status(500).json({ message: "Fel vid hämtning av bokning" });
  }
};

export const getAvailableSeatsHandler = (req, res) => {
  const { screeningId } = req.params;

  try {
    // Hämta screening för att avgöra vilken salong som används
    const screeningStmt = db.prepare(
      "SELECT * FROM screenings WHERE screening_id = ?"
    );
    const screening = screeningStmt.get(screeningId);
    if (!screening) {
      return res.status(404).json({ message: "Screening hittades inte" });
    }

    // Hämta alla säten för salongen
    const seatsStmt = db.prepare("SELECT * FROM seats WHERE salon_id = ?");
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
    console.error("Fel vid hämtning av lediga säten:", error);
    res.status(500).json({ message: "Fel vid hämtning av lediga säten" });
  }
};

export const getUserBookingsHandler = (req, res) => {
  const userId = req.user.id; // Hämtas från auth-middleware
  try {
    const bookings = getBookingsByUserId(userId);
    res.json(bookings);
  } catch (error) {
    console.error("Error retrieving bookings for user:", error);
    res.status(500).json({ message: "Error retrieving bookings" });
  }
};

export const getAllBookingsHandler = (req, res) => {
  try {
    const bookings = getAllBookings();
    res.json(bookings);
  } catch (error) {
    console.error("Error retrieving all bookings:", error);
    res.status(500).json({ message: "Error retrieving all bookings" });
  }
};
