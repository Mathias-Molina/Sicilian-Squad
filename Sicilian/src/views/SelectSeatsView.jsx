import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAvailableSeats } from "../api/apiSeats";
import { createBooking } from "../api/apiBookings";
import { getScreeningDetails } from "../api/apiScreenings"; 

export const SelectSeatsView = () => {
  const { screeningId } = useParams();
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [numPersons, setNumPersons] = useState(1);
  const [pricePerTicket, setPricePerTicket] = useState(0);

  useEffect(() => {
    getScreeningDetails(screeningId)
      .then(data => {
        setPricePerTicket(data.screening_price);
      })
      .catch(err => {
        console.error("Fel vid hämtning av screeningdetaljer:", err);
      });
  }, [screeningId]);

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

  const totalPrice = numPersons * pricePerTicket;

  const handleNumPersonsChange = e => {
    const newNum = parseInt(e.target.value);
    setNumPersons(newNum);
    // Om det nya antalet är mindre än redan valda säten, rensa valet
    if (selectedSeats.length > newNum) {
      setSelectedSeats([]);
    }
  };

  // Låter användaren välja ett säte, men begränsar antalet till numPersons
  const toggleSeatSelection = (seatId, available) => {
    if (!available) return;
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      if (selectedSeats.length < numPersons) {
        setSelectedSeats([...selectedSeats, seatId]);
      } else {
        alert(`Du kan bara välja ${numPersons} säten.`);
      }
    }
  };

  const handleBooking = () => {
    if (selectedSeats.length !== numPersons) {
      alert(`Vänligen välj exakt ${numPersons} säten.`);
      return;
    }

    // Använd en standardbiljett (t.ex. "vuxen") för varje valt säte
    const ticketTypes = selectedSeats.map(() => "vuxen");

    const bookingData = {
      screeningId,
      seats: selectedSeats,
      totalPrice,
      ticketTypes,
    };

    createBooking(bookingData)
      .then(response => {
        alert("Bokning skapad! Bokningsnummer: " + response.bookingNumber);
      })
      .catch(err => {
        console.error("Fel vid bokning:", err);
        alert("Något gick fel vid bokningen.");
      });
  };

  if (loading) return <div>Laddar säten...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section>
      <h1>Välj platser för filmvisning {screeningId}</h1>
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
        <p>Totalpris: {totalPrice} kr</p>
      </div>
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
      </div>
      <div>
        <button onClick={handleBooking}>Boka film</button>
      </div>
    </section>
  );
};
