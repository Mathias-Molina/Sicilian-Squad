import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAvailableSeats } from "../api/apiSeats";

export const SelectSeatsView = () => {
  const { screeningId } = useParams();
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAvailableSeats(screeningId)
      .then(data => {
        setSeats(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || "Fel vid hämtning av lediga säten");
        setLoading(false);
      });
  }, [screeningId]);

  const toggleSeatSelection = (seatId, available) => {
    if (!available) return; // Kan inte välja upptaget säte
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  if (loading) return <div>Laddar säten...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section>
      <h1>Välj platser för filmvisning {screeningId}</h1>
      <div className="salon-map">
        {seats.map(seat => (
          <button
            key={seat.seat_id}
            onClick={() => toggleSeatSelection(seat.seat_id, seat.available)}
            style={{
              backgroundColor: seat.available
                ? selectedSeats.includes(seat.seat_id)
                  ? "blue"
                  : "green"
                : "red",
              margin: "5px",
              padding: "10px",
            }}
            disabled={!seat.available}
          >
            {seat.seat_rowNumber}-{seat.seat_number}
          </button>
        ))}
      </div>
      <div>
        <h2>Valda platser: {selectedSeats.join(", ")}</h2>
        {/* Här kan du lägga till en dropdown för antal biljetter och beräkning av pris */}
      </div>
    </section>
  );
};
