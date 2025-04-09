import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAvailableSeats } from "../api/apiSeats";
import { createBooking } from "../api/apiBookings";
import { getScreeningDetails } from "../api/apiScreenings";
import { useNavigate } from "react-router-dom"; {/*Maricel * to navigate to BookingConfirmationView*/ }


export const SelectSeatsView = () => {
  const { screeningId } = useParams();
  const navigate = useNavigate(); {/*Maricel * to navigate to BookingConfirmationView*/ }
  const [movieDetails, setMovieDetails] = useState(null);

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatTicketTypes, setSeatTicketTypes] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [numPersons, setNumPersons] = useState(1);
  const [pricePerTicket, setPricePerTicket] = useState(0);

  useEffect(() => {
    getScreeningDetails(screeningId)
      .then(data => {
        setPricePerTicket(data.screening_price);
        setMovieDetails(data.movie);
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

  // Funktion för att returnera pris-multiplikator baserat på biljett-typ
  const getMultiplier = type => {
    if (type === "barn") return 0.5;
    if (type === "student") return 0.8;
    return 1.0; // vuxen
  };

  // Räkna ut totala priset baserat på vald biljett-typ för varje valt säte
  const totalPrice = selectedSeats.reduce((sum, seatId) => {
    const ticketType = seatTicketTypes[seatId] || "vuxen";
    return sum + pricePerTicket * getMultiplier(ticketType);
  }, 0);

  const handleNumPersonsChange = e => {
    const newNum = parseInt(e.target.value);
    setNumPersons(newNum);
    // Om det nya antalet är mindre än redan valda säten, rensa valet
    if (selectedSeats.length > newNum) {
      // Ta bort överskjutande säten och dess biljett-typ
      const newSelected = selectedSeats.slice(0, newNum);
      setSelectedSeats(newSelected);
      const newTicketTypes = {};
      newSelected.forEach(seatId => {
        newTicketTypes[seatId] = seatTicketTypes[seatId] || "vuxen";
      });
      setSeatTicketTypes(newTicketTypes);
    }
  };

  // Låter användaren välja ett säte, men begränsar antalet till numPersons
  const toggleSeatSelection = (seatId, available) => {
    if (!available) return;
    if (selectedSeats.includes(seatId)) {
      // Ta bort säte och dess biljett-typ
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
      const newTicketTypes = { ...seatTicketTypes };
      delete newTicketTypes[seatId];
      setSeatTicketTypes(newTicketTypes);
    } else {
      if (selectedSeats.length < numPersons) {
        setSelectedSeats([...selectedSeats, seatId]);
        // Sätt standardbiljett-typ till "vuxen"
        setSeatTicketTypes({ ...seatTicketTypes, [seatId]: "vuxen" });
      } else {
        alert(`Du kan bara välja ${numPersons} säten.`);
      }
    }
  };

  const handleTicketTypeChange = (seatId, newType) => {
    setSeatTicketTypes({
      ...seatTicketTypes,
      [seatId]: newType,
    });
  };

  const handleBooking = () => {
    if (selectedSeats.length !== numPersons) {
      alert(`Vänligen välj exakt ${numPersons} säten.`);
      return;
    }

    // Använd en standardbiljett (t.ex. "vuxen") för varje valt säte
    //const ticketTypes = selectedSeats.map(() => "vuxen");

    const bookingData = {
      screeningId,
      seats: selectedSeats,
      totalPrice,
      ticketTypes: seatTicketTypes
    };
    console.log("Booking data:", bookingData);

    createBooking(bookingData)
      .then(response => {
        console.log("Booking response:", response);
        navigate("/booking-confirmation", {
          state: {
            bookingNumber: response.bookingNumber,
            bookingId: response.bookingId,
            seats: selectedSeats,
            ticketTypes: seatTicketTypes,
            totalPrice,
            movieTitle: movieDetails.movie_title,      // 👈 Add this
            moviePoster: movieDetails.movie_poster  
          }
        });
      })
      .catch(err => {
        console.error("Fel vid bokning:", err);
        alert("Något gick fel vid bokningen.");
      });

   {/*} createBooking(bookingData)
      .then(response => {
        alert("Bokning skapad! Bokningsnummer: " + response.bookingNumber);
      })
      .catch(err => {
        console.error("Fel vid bokning:", err); 
        alert("Något gick fel vid bokningen.");
      });*/}
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
        <p>Totalpris: {totalPrice.toFixed(2)} kr</p>
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
        <h2>Valda platser:</h2>
        {selectedSeats.map(seatId => (
          <div key={seatId}>
            <span>Säte {seatId}: </span>
            <select
              value={seatTicketTypes[seatId] || "vuxen"}
              onChange={e => handleTicketTypeChange(seatId, e.target.value)}
            >
              <option value="vuxen">Vuxen (100%)</option>
              <option value="student">Student (80%)</option>
              <option value="barn">Barn (50%)</option>
            </select>
          </div>
        ))}
      </div>
      <div>
        <button onClick={handleBooking}>Boka film</button>
      </div>
    </section>
  );
};
