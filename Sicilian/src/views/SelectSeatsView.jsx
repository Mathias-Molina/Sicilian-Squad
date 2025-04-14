import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAvailableSeats } from "../api/apiSeats";
import { createBooking } from "../api/apiBookings";
import { getScreeningDetails } from "../api/apiScreenings";

import { getSalonById } from "../api/apiSalons";
import "./SelectSeatsView.css";
import { ErrorMessage } from "../components/Errormessage"; // Added for replacing alert message to red text -Maricel

export const SelectSeatsView = () => {
  const { screeningId, salonId } = useParams();
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [salon, setSalon] = useState([]);
  const [seatTicketTypes, setSeatTicketTypes] = useState({});
  const [error, setError] = useState("");
  const [movieTitle, setMovieTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [numPersons, setNumPersons] = useState(1);
  const [pricePerTicket, setPricePerTicket] = useState(0);
  const [bookingError, setBookingError] = useState("");
  {
    /* Added for replacing alert message to red text -Maricel*/
  }
  const navigate = useNavigate();

  useEffect(() => {
    getScreeningDetails(screeningId)
      .then((data) => {
        setPricePerTicket(data.screening_price);
        setMovieTitle(data.movie_title);
      })
      .catch((err) => {
        console.error("Fel vid hämtning av screeningdetaljer:", err);
      });
  }, [screeningId]);

  useEffect(() => {
    getAvailableSeats(screeningId)
      .then((data) => {
        setSeats(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Fel vid hämtning av lediga säten");
        setLoading(false);
      });
  }, [screeningId]);


  useEffect(() => {
    getAvailableSeats(screeningId)
      .then((data) => {
        setSeats(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Fel vid hämtning av lediga säten");
        setLoading(false);
      });
  }, [screeningId]);

  useEffect(() => {
    getSalonById(salonId)
      .then((data) => {
        setSalon(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Fel vid hämtning av lediga säten");
        setLoading(false);
      });
  }, [salonId]);

  // Funktion för att returnera pris-multiplikator baserat på biljett-typ
 
  const getMultiplier = type => {

    if (type === "barn") return 0.5;
    if (type === "student") return 0.8;
    return 1.0; // vuxen
  };

  const totalPrice = selectedSeats.reduce((sum, seatId) => {
    const ticketType = seatTicketTypes[seatId] || "vuxen";
    return sum + pricePerTicket * getMultiplier(ticketType);
  }, 0);

  const handleNumPersonsChange = (e) => {
    const newNum = parseInt(e.target.value);
    setNumPersons(newNum);

    if (selectedSeats.length === newNum) {
      setBookingError("");
    }
    // Om det nya antalet är mindre än redan valda säten, rensa valet
    if (selectedSeats.length > newNum) {
      const newSelected = selectedSeats.slice(0, newNum);
      // Ta bort överskjutande säten och dess biljett-typ
      setSelectedSeats(newSelected);
      const newTicketTypes = {};
      newSelected.forEach((seatId) => {
        newTicketTypes[seatId] = seatTicketTypes[seatId] || "vuxen";
      });
      setSeatTicketTypes(newTicketTypes);
    }
  };

  // Låter användaren välja ett säte, men begränsar antalet till numPersons
  const toggleSeatSelection = (seatId, available) => {
    if (!available) return;

    let newSelectedSeats; // Variabeln ska få ett värde i båda grenarna

    if (selectedSeats.includes(seatId)) {

      // Ta bort säte och dess biljett-typ
      setSelectedSeats(selectedSeats.filter((id) => id !== seatId));
      // Om säte redan är valt, ta bort det och uppdatera biljett-typerna
      newSelectedSeats = selectedSeats.filter(id => id !== seatId);

      const newTicketTypes = { ...seatTicketTypes };
      delete newTicketTypes[seatId];
      setSeatTicketTypes(newTicketTypes);
    } else {
      // Lägg till säte
      if (selectedSeats.length < numPersons) {
        newSelectedSeats = [...selectedSeats, seatId];
        // Sätt standardbiljett-typ till "vuxen"
        setSeatTicketTypes({ ...seatTicketTypes, [seatId]: "vuxen" });
      } else {
        setBookingError(`Du kan bara välja ${numPersons} säten.`);
        return;
      }
    }

    // Nu är newSelectedSeats definierad oavsett gren
    setSelectedSeats(newSelectedSeats);

    // Rensa eventuellt felmeddelande om antalet valda säten motsvarar numPersons
    if (newSelectedSeats.length === numPersons) {
      setBookingError("");
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
      setBookingError(`Vänligen välj exakt ${numPersons} säten.`);
      return;
    }

    const ticketTypes = selectedSeats.map(
      (seatId) => seatTicketTypes[seatId] || "vuxen"
    );

    const bookingData = {
      screeningId,
      seats: selectedSeats,
      totalPrice,
      ticketTypes,
    };

    createBooking(bookingData)
      .then(response => {
        setBookingError(
          "Bokning skapad! Bokningsnummer: " + response.bookingNumber
        );
        navigate(`/bookings/${response.bookingNumber}`);
      })
      .catch((err) => {
        console.error("Fel vid bokning:", err);
        setBookingError("Något gick fel vid bokningen.");
        {
          /* Added for replacing alert message to red text -Maricel*/
        }
      });
  };

  if (loading) return <div>Laddar säten...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section className="page">
      <h1>Välj platser för filmvisning: {movieTitle}</h1>
      <div className="booking-form">
        <label>
          Antal personer:
          <select value={numPersons} onChange={handleNumPersonsChange}>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <p>Totalpris: {totalPrice.toFixed(2)} kr</p>
      </div>
      <div className="salon-map">
        <div className="salon-screen">Screen</div>
        <div
          style={{
            display: "grid",
            gridGap: "6px",
            gridTemplateColumns: `repeat(${salon.salon_rowSeats}, min-content)`,
          }}
        >
          {seats.map((seat) => (
            <button
              key={seat.seat_number}
              onClick={() =>
                toggleSeatSelection(seat.seat_number, seat.available)
              }
              className={`salon-seat ${!seat.available && "occupied"} ${
                selectedSeats.includes(seat.seat_number) && "selected"
              }`}
              disabled={!seat.available}
            >
              {seat.available && `${seat.seat_rowNumber} - ${seat.seat_number}`}
            </button>
          ))}
        </div>
      </div>
      <div className="chosen-seats">
        <h2>Valda platser</h2>
        {selectedSeats.map((seatNumber) => (
          <div className="selected-seat" key={seatNumber}>
            <span>Säte {seatNumber}: </span>
            <select
              value={seatTicketTypes[seatNumber] || "vuxen"}
              onChange={(e) =>
                handleTicketTypeChange(seatNumber, e.target.value)
              }
            >
              <option value="vuxen">Vuxen (100%)</option>
              <option value="student">Student (80%)</option>
              <option value="barn">Barn (50%)</option>
            </select>
          </div>
        ))}
      </div>
      <div>
        <button className="book-button" onClick={handleBooking}>
          Boka film
        </button>
      </div>
    </section>
  );
};
