import { useParams } from 'react-router-dom';
import { BookingCards } from '../components/BookingCards';

export const BookingDetailsView = () => {
  const { bookingId } = useParams();
  return (
    <div>
      <BookingCards bookingNumber={bookingId} />
    </div>
  );
};
