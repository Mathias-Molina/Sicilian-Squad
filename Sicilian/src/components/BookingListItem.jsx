import { Link } from 'react-router-dom';

export const BookingListItem = ({ booking, type }) => {
  const bookingClass =
    type === 'upcoming' ? 'upcoming-booking' : 'past-booking';
  return (
    <li className={bookingClass}>
      <img
        src={booking.movie_poster}
        alt={`Poster för ${booking.movie_title}`}
        className='booking-poster'
      />
      <div className='booking-info'>
        <h3>{booking.movie_title}</h3>
        <p>
          <span>Tid:</span>{' '}
          {new Date(booking.screening_time).toLocaleString('sv-SE', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
        <p>
          <span>Salong:</span> {booking.salon_name}
        </p>
        <p>
          <span>Biljetter:</span> {booking.number_of_tickets}
        </p>
        <p>
          <span>Bokningsnummer:</span> {booking.booking_number}
        </p>
        <Link
          to={`/bookings/${booking.booking_number}`}
          className='booking-link'
        >
          [Visa bokning]
        </Link>
      </div>
    </li>
  );
};
