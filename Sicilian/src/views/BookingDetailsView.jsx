import { useParams } from "react-router-dom";
import { BookingCards } from "../components/BookingCards";
import { StepIndicator } from "../components/StepIndicator";

export const BookingDetailsView = () => {
  const { bookingId } = useParams();
  return (
    <div>
      <StepIndicator currentStep={5} />
      <BookingCards bookingNumber={bookingId} />
    </div>
  );
};
