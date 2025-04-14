import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { getBookingsByUserId } from "../api/apiBookings";
import { Link } from "react-router-dom";

export const MinaBokningar = () => {
  const { user, isLoading } = useContext(UserContext);
  const [bookings, setBookings] = useState(null);

  useEffect(() => {
    console.log("user i MinaBokningar:", user);
    if (!user?.user_id) return;

    const fetchBookings = async () => {
      try {
        // Anta att getBookingsByUserId nu returnerar ett objekt med
        // { upcomingBookings: [...], pastBookings: [...] }
        const data = await getBookingsByUserId(user.user_id);
        setBookings(data);
      } catch (error) {
        console.error("Fel vid hämtning av bokningar:", error);
        setBookings({ upcomingBookings: [], pastBookings: [] });
      }
    };

    fetchBookings();
  }, [user?.user_id]);

  if (isLoading) return <p>Laddar användarinfo...</p>;
  if (!user) return <p>Du måste vara inloggad för att se dina bokningar.</p>;
  if (bookings === null) return <p>Hämtar bokningar...</p>;

  return (
    <div className="p-4">
      <h1>Mina bokningar</h1>

      <h2>Kommande bokningar</h2>
      {bookings.upcomingBookings && bookings.upcomingBookings.length > 0 ? (
        <ul className="space-y-2">
          {bookings.upcomingBookings.map(booking => (
            <li key={booking.booking_number}>
              Bokning: {booking.booking_number} <br />
              <Link
                className="text-blue-600 underline"
                to={`/bookings/${booking.booking_number}`}
              >
                Visa
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>Inga kommande bokningar hittades.</p>
      )}

      <h2>Bokningshistorik</h2>
      {bookings.pastBookings && bookings.pastBookings.length > 0 ? (
        <ul className="space-y-2">
          {bookings.pastBookings.map(booking => (
            <li key={booking.booking_number}>
              Bokning: {booking.booking_number} <br />
              <Link
                className="text-blue-600 underline"
                to={`/bookings/${booking.booking_number}`}
              >
                Visa
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>Inga historiska bokningar hittades.</p>
      )}
    </div>
  );
};
