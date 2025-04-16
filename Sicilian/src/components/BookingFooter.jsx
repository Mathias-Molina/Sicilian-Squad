import React from "react";
import { ErrorMessage } from "../components/Errormessage";

export const BookingFooter = ({
  selectedSeats,
  seatTicketTypes,
  handleTicketTypeChange,
  bookingError,
  onBooking,
}) => {
  return (
    <>
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
              <option value="student">Student (80%)</option>
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
    </>
  );
};
