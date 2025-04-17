import { ErrorMessage } from "../components/Errormessage";

export const BookingFooter = ({
  selectedSeats,
  seatTicketTypes,
  handleTicketTypeChange,
  bookingError,
  onBooking,
}) => {
  const getTooltipText = type => {
    switch (type) {
      case "barn":
        return "Barn: 50% rabatt (upp till 12 år)";
      case "student":
        return "Student: 80% av priset – studentkort krävs";
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
        {selectedSeats.map(seatNumber => (
          <div className="selected-seat" key={seatNumber}>
            <span>Säte {seatNumber}: </span>

            <div className="tooltip-wrapper">
              <select
                value={seatTicketTypes[seatNumber] || "vuxen"}
                onChange={e =>
                  handleTicketTypeChange(seatNumber, e.target.value)
                }
              >
                <option value="vuxen">Vuxen</option>
                <option value="student">Student</option>
                <option value="barn">Barn</option>
              </select>
              <span className="tooltip-text">
                {getTooltipText(seatTicketTypes[seatNumber] || "vuxen")}
              </span>
            </div>
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
