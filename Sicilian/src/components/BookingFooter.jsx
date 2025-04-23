import { TicketTypeInfo } from "./TicketTypeInfo";

export const BookingFooter = ({
  selectedSeats,
  seatTicketTypes,
  handleTicketTypeChange,
  bookingError,
  onBooking,
  showInfo,
  toggleInfo,
}) => {
  const getTooltipText = type => {
    switch (type) {
      case "barn":
        return "Barn: 50% rabatt (upp till 12 år)";
      case "pensionär":
        return "Pensionär: 80% – Identifiering krävs";
      default:
        return "Vuxen: Ordinarie pris";
    }
  };

  return (
    <div className="booking-footer">
      <div className="booking-footer__chosen-seats">
        {/* NY HEADER MED INFOKNAPP */}
        <div className="booking-footer__header">
          <h2>Valda platser</h2>
          <button
            className="booking-footer__info-button"
            onClick={toggleInfo}
            aria-label="Visa biljettinformation"
          >
            ℹ️
          </button>
        </div>

        {/* Visa popupen direkt under headern */}
        {showInfo && <TicketTypeInfo />}

        {/* Resten av listan med valda säten */}
        {selectedSeats.map(seatNumber => {
          const type = seatTicketTypes[seatNumber] || "vuxen";
          return (
            <div className="booking-footer__seat" key={seatNumber}>
              <span className="booking-footer__seat-label">
                Säte {seatNumber}:
              </span>
              <div className="booking-footer__tooltip">
                <select
                  className="booking-footer__select"
                  value={type}
                  onChange={e =>
                    handleTicketTypeChange(seatNumber, e.target.value)
                  }
                >
                  <option value="vuxen">Vuxen (100%)</option>
                  <option value="pensionär">Pensionär (80%)</option>
                  <option value="barn">Barn (50%)</option>
                </select>
                <div className="booking-footer__tooltip-text">
                  {getTooltipText(type)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {bookingError && (
        <div className="booking-footer__error">{bookingError}</div>
      )}

      <button
        className="booking-footer__button"
        onClick={onBooking}
        disabled={selectedSeats.length === 0}
      >
        Boka film
      </button>
    </div>
  );
};
