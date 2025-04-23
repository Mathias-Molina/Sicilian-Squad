export const SeatMap = ({
  seats,
  salon,
  toggleSeatSelection,
  selectedSeats,
}) => {
  return (
    <div className="seat-map">
      <div className="seat-map__screen">Screen</div>
      <div
        className="seat-map__grid"
        style={{
          gridTemplateColumns: `repeat(${salon.salon_rowSeats}, min-content)`,
        }}
      >
        {seats.map(seat => {
          const isSelected = selectedSeats.includes(seat.seat_number);
          const seatClasses = [
            "seat-map__seat",
            !seat.available && "seat-map__seat--occupied",
            isSelected && "seat-map__seat--selected",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              key={seat.seat_number}
              onClick={() =>
                toggleSeatSelection(seat.seat_number, seat.available)
              }
              className={seatClasses}
              disabled={!seat.available}
            >
              {`${seat.seat_rowNumber} - ${seat.seat_number}`}
            </button>
          );
        })}
      </div>
    </div>
  );
};
