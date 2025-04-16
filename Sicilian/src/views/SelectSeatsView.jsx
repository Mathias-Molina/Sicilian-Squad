import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BookingForm } from "../components/BookingPanel";
import { SeatMap } from "../components/SeatMap";
import { BookingFooter } from "../components/BookingFooter";
import { useScreening } from "../hooks/useScreening";
import { useSalon } from "../hooks/useSalon";
import { useSeat } from "../hooks/useSeat";
import { useBooking } from "../hooks/useBooking";

export const SelectSeatsView = () => {
  const { screeningId, salonId } = useParams();
  const navigate = useNavigate();

  const [numPersons, setNumPersons] = useState(1);

  const { pricePerTicket, movieTitle, loadingScreening, errorScreening } =
    useScreening(screeningId);
  const { salon, loadingSalon, errorSalon } = useSalon(salonId);
  const {
    seats,
    selectedSeats,
    seatTicketTypes,
    loadingSeats,
    errorSeats,
    toggleSeatSelection,
    handleTicketTypeChange,
    setSelectedSeats,
    setSeatTicketTypes,
  } = useSeat(screeningId, numPersons);
  const { bookingError, handleBooking, setBookingError } = useBooking();

  const getMultiplier = type => {
    if (type === "barn") return 0.5;
    if (type === "pensionär") return 0.8;
    return 1.0;
  };

  const totalPrice = selectedSeats.reduce((sum, seatId) => {
    const ticketType = seatTicketTypes[seatId] || "vuxen";
    return sum + pricePerTicket * getMultiplier(ticketType);
  }, 0);

  const handleNumPersonsChange = e => {
    const newNum = parseInt(e.target.value);
    setNumPersons(newNum);

    if (selectedSeats.length === newNum) {
      setBookingError("");
    }
    if (selectedSeats.length > newNum) {
      const newSelected = selectedSeats.slice(0, newNum);
      setSelectedSeats(newSelected);
      const newTicketTypes = {};
      newSelected.forEach(seatId => {
        newTicketTypes[seatId] = seatTicketTypes[seatId] || "vuxen";
      });
      setSeatTicketTypes(newTicketTypes);
    }
  };

  const onBookingClick = async () => {
    if (selectedSeats.length !== numPersons) {
      setBookingError(`Vänligen välj exakt ${numPersons} säten.`);
      return;
    }
    const ticketTypes = selectedSeats.map(
      seatId => seatTicketTypes[seatId] || "vuxen"
    );
    const response = await handleBooking({
      screeningId,
      selectedSeats,
      totalPrice,
      ticketTypes,
    });
    if (response) {
      navigate(`/bookings/${response.bookingNumber}`);
    }
  };

  if (loadingScreening || loadingSalon || loadingSeats)
    return <div>Laddar data...</div>;
  if (errorScreening || errorSalon || errorSeats)
    return <div>{errorScreening || errorSalon || errorSeats}</div>;

  return (
    <section className="page">
      <BookingForm
        movieTitle={movieTitle}
        numPersons={numPersons}
        handleNumPersonsChange={handleNumPersonsChange}
        totalPrice={totalPrice}
      />
      <SeatMap
        seats={seats}
        salon={salon}
        toggleSeatSelection={toggleSeatSelection}
        selectedSeats={selectedSeats}
      />
      <BookingFooter
        selectedSeats={selectedSeats}
        seatTicketTypes={seatTicketTypes}
        handleTicketTypeChange={handleTicketTypeChange}
        bookingError={bookingError}
        onBooking={onBookingClick}
      />
    </section>
  );
};
