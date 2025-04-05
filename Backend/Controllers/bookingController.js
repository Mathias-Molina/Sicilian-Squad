import { db } from "../Config/database.js";
import {
  createBooking,
  createBookingSeat
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
  
