import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BookingForm } from "../components/BookingForm";
import { SeatMap } from "../components/SeatMap";
import { BookingFooter } from "../components/BookingFooter";
import { useScreening } from "../hooks/useScreening";
import { useSalon } from "../hooks/useSalon";
import { useSeat } from "../hooks/useSeat";
import { useBooking } from "../hooks/useBooking";
import { StepIndicator } from "../components/StepIndicator";

export const SelectSeatsView = () => {
  const { screeningId, salonId } = useParams();
  const navigate = useNavigate();
  const [numPersons, setNumPersons] = useState(1);
  const [currentStep, setCurrentStep] = useState(2);
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
  const [showInfo, setShowInfo] = useState(false);

  const getMultiplier = type => {
    if (type === "barn") return 0.5;
    if (type === "pensionär") return 0.8;
    return 1.0;
  };

  const totalPrice = selectedSeats.reduce((sum, seatId) => {
    const ticketType = seatTicketTypes[seatId] || "vuxen";
    return sum + pricePerTicket * getMultiplier(ticketType);
  }, 0);

  const handleNumChange = e => {
    const newNum = parseInt(e.target.value, 10);
    setNumPersons(newNum);
    setBookingError("");
    setCurrentStep(3);

    if (selectedSeats.length > newNum) {
      const trimmed = selectedSeats.slice(0, newNum);
      setSelectedSeats(trimmed);
      const newTypes = {};
      trimmed.forEach(id => {
        newTypes[id] = seatTicketTypes[id] || "vuxen";
      });
      setSeatTicketTypes(newTypes);
    }
  };

  const handleSeatClickWrapper = (seatId, available) => {
    const isSelected = selectedSeats.includes(seatId);


    if (isSelected) {
      setBookingError(""); // clear error when deselecting
      const newSelected = selectedSeats.filter(id => id !== seatId);
      setSelectedSeats(newSelected);
      setCurrentStep(3);
    } else {
      if (selectedSeats.length >= numPersons) {
        setBookingError(`Du kan bara välja ${numPersons} säten.`);
        return;
      }
      

      setBookingError(""); // clear error if adding is allowed
      const newSelected = [...selectedSeats, seatId];
      setSelectedSeats(newSelected);
      if (newSelected.length === numPersons) {
        setCurrentStep(4);
      } else {
        setCurrentStep(3);
      }
    }

    toggleSeatSelection(seatId, available);
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

    if (response && response.bookingNumber) {
      const newBookingNumber = response.bookingNumber;
      navigate(`/bookings/${newBookingNumber}`, {
        state: { fromNewBooking: true },
      });
    }
  };

  if (loadingScreening || loadingSalon || loadingSeats)
    return <div>Laddar data...</div>;
  if (errorScreening || errorSalon || errorSeats)
    return <div>{errorScreening || errorSalon || errorSeats}</div>;

  return (
    <section className="page">
      <StepIndicator currentStep={currentStep} />

      <BookingForm
        movieTitle={movieTitle}
        numPersons={numPersons}
        handleNumPersonsChange={handleNumChange}
        totalPrice={totalPrice}
      />

      <SeatMap
        seats={seats}
        salon={salon}
        toggleSeatSelection={handleSeatClickWrapper}
        selectedSeats={selectedSeats}
      />

      <BookingFooter
        selectedSeats={selectedSeats}
        seatTicketTypes={seatTicketTypes}
        handleTicketTypeChange={handleTicketTypeChange}
        bookingError={bookingError}
        onBooking={onBookingClick}
        showInfo={showInfo}
        toggleInfo={() => setShowInfo(!showInfo)}
      />
    </section>
  );
};
