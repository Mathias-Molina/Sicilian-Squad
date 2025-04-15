import { Link } from 'react-router-dom';

export const BookingListItem = ({ booking }) => {
  return (
    <div className='p-4 border rounded-lg shadow-sm'>
      <h3 className='text-lg font-bold'>{booking.movie_title}</h3>
      <p>
        Tid:{' '}
        <strong>
          {new Date(booking.screening_time).toLocaleString('sv-SE', {
            dateStyle: 'long',
            timeStyle: 'short',
          })}
        </strong>
      </p>
      <p>Salong: {booking.salon_name}</p>
      <p>Biljetter: {booking.number_of_tickets}</p>
      <p>
        Bokningsnummer: <code>{booking.booking_number}</code>
      </p>
      <Link
        className='text-blue-600 underline mt-2 inline-block'
        to={`/bookings/${booking.booking_number}`}
      >
        Visa bokning
      </Link>
    </div>
  );
};
