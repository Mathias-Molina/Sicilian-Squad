import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { getBookingsByUserId } from '../api/apiBookings';
import { Link } from 'react-router-dom';
import { BookingCards } from '../components/BookingCards';

export const MinaBokningar = () => {
  const { user, isLoading } = useContext(UserContext);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!user || !user.user_id) return;
    const fetchBookings = async () => {
      try {
        const data = await getBookingsByUserId(user.user_id);
        setBookings(data);
      } catch (error) {
        console.error('Fel vid hämtning av bokningar:', error);
      }
    };

    fetchBookings();
  }, [user]);

  if (isLoading || !user) {
    return <div>Laddar användarens bokningar...</div>;
  }

  return (
    <div className='p-4'>
      <h1>Mina bokningar</h1>
      {bookings.length === 0 ? (
        <p>Inga bokningar hittades.</p>
      ) : (
        <ul className='space-y-2'>
          {bookings.map(booking => (
            <li key={booking.booking_number}>
              Bokning: {booking.booking_number} <br />
              <Link
                className='text-blue-600 underline'
                to={`/bookings/${booking.booking_number}`}
              >
                Visa
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
