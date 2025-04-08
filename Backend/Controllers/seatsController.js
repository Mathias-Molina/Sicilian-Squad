import { getSeatsByBookingId } from '../Models/seatsModel.js';
import { getBookingSeatsWithSeatInfo } from '../Models/bookingModel.js';

export const getSeatsByBookingIdHandler = (req, res) => {
  const { bookingId } = req.params;

  if (!bookingId) {
    return res.status(400).json({ error: 'Booking ID saknas' });
  }

  try {
    const seats = getSeatsByBookingId(bookingId);

    if (!seats || seats.length === 0) {
      return res
        .status(404)
        .json({ error: 'Inga platser hittades för denna bokning' });
    }

    res.json(seats);
  } catch (error) {
    console.error('Fel vid hämtning av bokade platser:', error);
    res.status(500).json({ error: 'Något gick fel vid hämtning av platser' });
  }
};

export const getDetailedSeatsByBookingIdHandler = (req, res) => {
  const { bookingId } = req.params;

  try {
    const seats = getBookingSeatsWithSeatInfo(bookingId);
    res.json(seats);
  } catch (error) {
    console.error('Fel vid hämtning av bokade platser:', error);
    res.status(500).json({ error: 'Kunde inte hämta platserna' });
  }
};
