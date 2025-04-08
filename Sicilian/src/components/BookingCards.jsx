import React, { useEffect, useState, useContext } from 'react';
import { getBookingsByUserId } from '../api/apiBookings';
import { getMovies } from '../api/apiMovies';
import { getAllScreenings } from '../api/apiScreenings';
import { UserContext } from '../context/UserContext';

export function BookingCards({ bookingNumber }) {
  const { user } = useContext(UserContext);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!user?.user_id || !bookingNumber) return;

      try {
        const allBookings = await getBookingsByUserId(user.user_id);

        const found = allBookings.find(b => b.booking_number === bookingNumber);

        if (!found) return;

        const allScreenings = await getAllScreenings();

        const screening = allScreenings.find(
          s => String(s.screening_id) === String(found.screening_id)
        );

        const allMovies = await getMovies();

        const movie = screening
          ? allMovies.find(m => m.movie_id === screening.movie_id)
          : null;

        console.log('Found booking:', found);
        console.log('Screening:', screening);
        console.log('All movies:', allMovies);

        setBooking({ ...found, screening, movie });
      } catch (error) {
        console.error('Fel vid hämtning av bokning:', error);
      }
    };

    fetchBooking();
  }, [user, bookingNumber]);

  if (booking) {
    console.log('POSTER:', booking.movie?.movie_poster);
  }

  if (!booking) return <p>Laddar bokning...</p>;

  return (
    <div>
      <h1>Bokningsbekräftelse</h1>
      <p>
        Bokningsnummer: <br />
        <strong>{bookingNumber}</strong>
      </p>
      {booking && (
        <p>
          Film: <br />
          <strong>
            {booking.movie?.movie_title || 'Ingen titel hittades'}
          </strong>
        </p>
      )}

      {booking?.movie?.movie_poster && (
        <img
          src={booking.movie.movie_poster}
          alt={booking.movie.movie_title || 'Filmposter'}
        />
      )}
    </div>
  );
}
