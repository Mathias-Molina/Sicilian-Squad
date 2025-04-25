import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { getDetailedBookingsByUserId } from '../api/apiBookings';
import { BookingListItem } from '../components/BookingListItem';
import { BookingGuestLookUp } from '../components/BookingGuestLookUp';

export const MinaBokningar = () => {
  const { user, isLoading } = useContext(UserContext);
  const [upcomingBookings, setUpcomingBookings] = useState(null);
  const [pastBookings, setPastBookings] = useState(null);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    if (!user?.user_id) return;

    const fetchBookings = async () => {
      try {
        const data = await getDetailedBookingsByUserId(user.user_id);
        setUpcomingBookings(data.upcomingBookings || []);
        setPastBookings(data.pastBookings.reverse() || []);
        setLoadingBookings(false);
      } catch (error) {
        console.error('Fel vid hämtning av bokningar:', error);
        setLoadingBookings(false);
      }
    };
    fetchBookings();
  }, [user]);

  if (isLoading) return <div className='loading'>Laddar användarinfo...</div>;
  if (!user) {
    return <BookingGuestLookUp />;
  }
  if (loadingBookings)
    return <div className='loading'>Hämtar bokningar...</div>;

  return (
    <div className='bookings-container'>
      <div className='section-wrapper'>
        <div id='upcoming-header' className='section-header'>
          <h2 className='section-title'>Kommande bokningar</h2>
        </div>
        <div className='section-content'>
          {upcomingBookings && upcomingBookings.length > 0 ? (
            <ul className='bookings-list'>
              {upcomingBookings.map(booking => (
                <BookingListItem
                  key={booking.booking_number}
                  booking={booking}
                  type='upcoming'
                />
              ))}
            </ul>
          ) : (
            <div className='empty-state'>Inga kommande bokningar hittades.</div>
          )}
        </div>
      </div>

      <div className='section-separator'></div>

      <div className='section-wrapper'>
        <div id='history-header' className='section-header'>
          <h2 className='section-title'>Bokningshistorik</h2>
        </div>

        <div className='section-content'>
          {pastBookings && pastBookings.length > 0 ? (
            <ul className='bookings-list'>
              {pastBookings.map(booking => (
                <BookingListItem
                  key={booking.booking_number}
                  booking={booking}
                  type='past'
                />
              ))}
            </ul>
          ) : (
            <div className='empty-state'>
              Inga historiska bokningar hittades.
            </div>
          )}
        </div>
      </div>
      <div className='spacer-20'></div>
    </div>
  );
};
