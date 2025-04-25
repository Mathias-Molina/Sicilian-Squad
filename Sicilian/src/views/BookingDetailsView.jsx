import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BookingCards } from "../components/BookingCards";
import { StepIndicator } from "../components/StepIndicator";

export const BookingDetailsView = () => {
  const { bookingNumber } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [showStepperOnce, setShowStepperOnce] = useState(
    location.state?.fromNewBooking === true
  );

  useEffect(() => {
    if (location.state?.fromNewBooking) {
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {showStepperOnce && <StepIndicator currentStep={5} />}
      <BookingCards bookingNumber={bookingNumber} />
    </div>
  );
};
