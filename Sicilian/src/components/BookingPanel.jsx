import React from "react";
import { ErrorMessage } from "../components/Errormessage";

export const BookingPanel = ({
  movieTitle,
  numPersons,
  handleNumPersonsChange,
  totalPrice,
  selectedSeats,
  seatTicketTypes,
  handleTicketTypeChange,
  bookingError,
  onBooking,
}) => {
  return (
    <div className="booking-panel">
      <h1>Välj platser för filmvisning: {movieTitle}</h1>
      <div className="booking-form">
        <label>
          Antal personer:
          <select value={numPersons} onChange={handleNumPersonsChange}>
            {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <p>Totalpris: {totalPrice.toFixed(2)} kr</p>
      </div>
      <div className="chosen-seats">
        <h2>Valda platser</h2>
        {selectedSeats.map(seatNumber => (
          <div className="selected-seat" key={seatNumber}>
            <span>Säte {seatNumber}: </span>
            <select
              value={seatTicketTypes[seatNumber] || "vuxen"}
              onChange={e => handleTicketTypeChange(seatNumber, e.target.value)}
            >
              <option value="vuxen">Vuxen (100%)</option>
              <option value="pensionär">Student (80%)</option>
              <option value="barn">Barn (50%)</option>
            </select>
          </div>
        ))}
      </div>
      <div>
        <ErrorMessage message={bookingError} />
        <button className="book-button" onClick={onBooking}>
          Boka film
        </button>
      </div>
    </div>
  );
};
