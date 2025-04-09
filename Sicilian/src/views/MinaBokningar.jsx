import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { getBookingsByUserId } from "../api/apiBookings";
import { Link } from "react-router-dom";
import { BookingCards } from "../components/BookingCards";

export const MinaBokningar = () => {
  const { user, isLoading } = useContext(UserContext);
  const [bookings, setBookings] = useState(null);

  useEffect(() => {
    console.log("user i MinaBokningar:", user);
    if (!user?.user_id) return;
    const fetchBookings = async () => {
      try {
        const data = await getBookingsByUserId(user.user_id);
        setBookings(data);
      } catch (error) {
        console.error("Fel vid hämtning av bokningar:", error);
        setBookings([]);
      }
    };

    fetchBookings();
  }, [user?.user_id]);

  if (isLoading) return <p>Laddar användarinfo...</p>;
  if (!user) return <p>Du måste vara inloggad för att se dina bokningar.</p>;
  if (bookings === null) return <p>Hämtar bokningar...</p>;
  if (bookings.length === 0) return <p>Inga bokningar hittades.</p>;

  return (
    <div className="p-4">
      <h1>Mina bokningar</h1>
      <ul className="space-y-2">
        {bookings.map(booking => (
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
    </div>
  );
};
