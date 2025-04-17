import { useEffect, useState, useContext } from 'react';
import { getBookingsByUserId, getBookingByNumber } from '../api/apiBookings';
import { getMovies } from '../api/apiMovies';
import { getAllScreenings } from '../api/apiScreenings';
import { UserContext } from '../context/UserContext';
import { getSalons } from '../api/apiSalons';
import { getSeatsByBookingId } from '../api/apiSeats';

export function BookingCards({ bookingNumber }) {
  const { user } = useContext(UserContext);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingNumber) return;

      try {
        let foundBooking = null;
        let seats = [];

        if (user?.user_id) {
          // Inloggad användare: hämta alla användarens bokningar
          const allBookings = await getBookingsByUserId(user.user_id);
          const combinedBookings = [
            ...(allBookings.upcomingBookings || []),
            ...(allBookings.pastBookings || []),
          ];

          foundBooking = combinedBookings.find(
            b => b.booking_number === bookingNumber
          );

          if (!foundBooking) return;
          seats = await getSeatsByBookingId(foundBooking.booking_id);
        } else {
          // Gäst: hämta bokning direkt via bokningsnummer
          const response = await getBookingByNumber(bookingNumber);
          foundBooking = response.booking;
          seats = response.seats;
        }

        const allScreenings = await getAllScreenings();
        const screening = allScreenings.find(
          s => String(s.screening_id) === String(foundBooking.screening_id)
        );

        const allMovies = await getMovies();
        const movie = screening
          ? allMovies.find(m => m.movie_id === screening.movie_id)
          : null;

        const allSalons = await getSalons();
        const salon = screening
          ? allSalons.find(
              s => String(s.salon_id) === String(screening.salon_id)
            )
          : null;

        setBooking({ ...foundBooking, screening, movie, salon, seats });
      } catch (error) {
        console.error('Fel vid hämtning av bokning:', error);
      }
    };

    fetchBooking();
  }, [user, bookingNumber]);

  if (!booking) return <p>Laddar bokning...</p>;

  const totalPrice =
    booking.seats?.reduce((sum, seat) => {
      return sum + parseFloat(seat.bookingSeat_price);
    }, 0) || 0;

  return (
    <div className='booking-confirmation-wrapper'>
      <div className='booking-card'>
        <h1 className='booking-title'>Bokningsbekräftelse</h1>

        <section className='section'>
          <p className='section-label'>Bokningsnummer:</p>
          <p>{bookingNumber}</p>
        </section>

        <section className='section'>
          <p className='section-label'>Film: </p>
          <p>{booking.movie?.movie_title || 'Ingen titel hittades'}</p>
        </section>

        {booking.movie?.movie_poster && (
          <section className='section'>
            <img
              className='movie-poster'
              src={booking.movie.movie_poster}
              alt={booking.movie.movie_title || 'Filmposter'}
            />
          </section>
        )}

        {booking.screening?.screening_time && (
          <section className='section'>
            <p className='section-label'>Visningstid: </p>
            <p>
              {new Date(booking.screening.screening_time).toLocaleString(
                'sv-SE',
                { dateStyle: 'long', timeStyle: 'short' }
              )}
            </p>
          </section>
        )}

        {booking.salon?.salon_name && (
          <section className='section'>
            <p className='section-label'>Salong: </p>
            <p>{booking.salon.salon_name}</p>
          </section>
        )}

        {booking.seats?.length > 0 && (
          <section className='section'>
            <p className='section-label'>Platser:</p>
            <ul className='seat-list'>
              {booking.seats.map((seat, index) => (
                <li key={index}>
                  <p>
                    Rad {seat.seat_rowNumber}, plats {seat.seat_number} (
                    {seat.bookingSeat_ticketType}) – {seat.bookingSeat_price} kr
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className='section total-price'>
          <p className='section-label'>Totalpris: </p>
          <p>{totalPrice} kr</p>
        </section>
      </div>
    </div>
  );
}
