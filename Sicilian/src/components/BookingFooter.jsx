import { useState } from "react";
import { TicketTypeInfo } from "./TicketTypeInfo";

export const BookingFooter = ({
  selectedSeats,
  seatTicketTypes,
  handleTicketTypeChange,
  bookingError,
  onBooking,
}) => {
  const [showInfo, setShowInfo] = useState(false);

  const getTooltipText = type => {
    switch (type) {
      case "barn":
        return "Barn: 50% rabatt (upp till 12 år)";
      case "pensionär":
        return "Pensionär: 80% – pensionärskort krävs";
      case "vuxen":
        return "Vuxen: Ordinarie pris";
      default:
        return "";
    }
  };

  return (
    <>
      <div className="chosen-seats">
        <h2>Valda platser</h2>

        {showInfo && <TicketTypeInfo />}

        {selectedSeats.map(seatNumber => {
          const type = seatTicketTypes[seatNumber] || "vuxen";
          return (
            <div className="selected-seat" key={seatNumber}>
              <span>Säte {seatNumber}: </span>

              <div className="tooltip-wrapper">
                <select
                  value={type}
                  onChange={e =>
                    handleTicketTypeChange(seatNumber, e.target.value)
                  }
                >
                  <option value="vuxen">Vuxen (100%)</option>
                  <option value="pensionär">Pensionär (80%)</option>
                  <option value="barn">Barn (50%)</option>
                </select>
                <span className="tooltip-text">{getTooltipText(type)}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <button className="book-button" onClick={onBooking}>
          Boka film
        </button>
      </div>
    </>
  );
};
