import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { getDetailedBookingsByUserId } from "../api/apiBookings";
import { BookingListItem } from "../components/BookingListItem";
import { LoadingSkeleton } from "../components/LoadingSkeleton";

const MIN_SKELETON_DELAY = 500;

export const MinaBokningar = () => {
  const { user, isLoading: authLoading } = useContext(UserContext);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [minDelayPassed, setMinDelayPassed] = useState(false);

  // Starta timer för minsta skeleton‑tid
  useEffect(() => {
    const timer = setTimeout(() => setMinDelayPassed(true), MIN_SKELETON_DELAY);
    return () => clearTimeout(timer);
  }, []);

  // Hämta bokningar när användaren är inloggad
  useEffect(() => {
    if (!user?.user_id) return;
    (async () => {
      try {
        const data = await getDetailedBookingsByUserId(user.user_id);
        setUpcomingBookings(data.upcomingBookings || []);
        setPastBookings(data.pastBookings || []);
      } catch (e) {
        console.error("Fel vid hämtning av bokningar:", e);
      } finally {
        setLoadingBookings(false);
      }
    })();
  }, [user]);

  // Funktion för att rendera skeleton-lista
  const renderSkeleton = () => (
    <ul>
      {Array.from({ length: 3 }).map((_, i) => (
        <li key={i} className="booking-list-item">
          <LoadingSkeleton width="96px" height="140px" />
          <div className="booking-info">
            <LoadingSkeleton width="50%" />
            <LoadingSkeleton width="40%" />
            <LoadingSkeleton width="30%" />
            <LoadingSkeleton width="20%" />
          </div>
        </li>
      ))}
    </ul>
  );

  // 1) Under auth‑koll, visa skeleton
  if (authLoading) {
    return renderSkeleton();
  }

  // 2) Gäster: skeleton fram till delay, sedan prompt
  if (!user) {
    if (!minDelayPassed) {
      return renderSkeleton();
    }
    return <p>Du måste vara inloggad för att se dina bokningar.</p>;
  }

  // 3) Inloggad: skeleton tills både booking-data och delay är klara
  if (loadingBookings || !minDelayPassed) {
    return renderSkeleton();
  }

  // 4) Visa faktiska bokningar
  return (
    <div className="section-title-wrapper">
      <h2 className="section-title">Kommande bokningar</h2>
      {upcomingBookings.length > 0 ? (
        <ul>
          {upcomingBookings.map(b => (
            <BookingListItem key={b.booking_number} booking={b} />
          ))}
        </ul>
      ) : (
        <p>Inga kommande bokningar hittades.</p>
      )}

      <h2 className="section-title">Bokningshistorik</h2>
      {pastBookings.length > 0 ? (
        <ul>
          {pastBookings.map(b => (
            <BookingListItem key={b.booking_number} booking={b} />
          ))}
        </ul>
      ) : (
        <p>Inga historiska bokningar hittades.</p>
      )}
    </div>
  );
};
