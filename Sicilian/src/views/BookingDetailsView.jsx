import { useParams } from "react-router-dom";
import { BookingCards } from "../components/BookingCards";

export const BookingDetailsView = () => {
  const { bookingNumber } = useParams();           
  return (
    <div>
      <BookingCards bookingNumber={bookingNumber} />  
    </div>
  );
};