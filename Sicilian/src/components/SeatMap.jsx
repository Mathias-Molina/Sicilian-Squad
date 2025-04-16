export const SeatMap = ({
  seats,
  salon,
  toggleSeatSelection,
  selectedSeats,
}) => {
  return (
    <div className="salon-map">
      <div className="salon-screen">Screen</div>
      <div
        style={{
          display: "grid",
          gridGap: "6px",
          gridTemplateColumns: `repeat(${salon.salon_rowSeats}, min-content)`,
        }}
      >
        {seats.map(seat => (
          <button
            key={seat.seat_number}
            onClick={() =>
              toggleSeatSelection(seat.seat_number, seat.available)
            }
            className={`salon-seat ${!seat.available ? "occupied" : ""} ${
              selectedSeats.includes(seat.seat_number) ? "selected" : ""
            }`}
            disabled={!seat.available}
          >
            {seat.available && `${seat.seat_rowNumber} - ${seat.seat_number}`}
          </button>
        ))}
      </div>
    </div>
  );
};
