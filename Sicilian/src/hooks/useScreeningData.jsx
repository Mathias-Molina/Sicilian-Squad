// src/hooks/useScreeningsData.jsx
import { useState, useEffect } from "react";
import { getScreeningsByDate } from "../api/apiScreenings";
import { getAvailableSeats } from "../api/apiSeats";
import { getSalons } from "../api/apiSalons";
// Ta bort getMovieById-importen helt!

export function useScreeningsData(date, isCustom) {
  const [screenings, setScreenings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");

      try {
        // 1) Hämta raw-screenings
        let raw = [];
        if (isCustom) {
          raw = await getScreeningsByDate(date);
        } else {
          const dates = [0, 1, 2].map(offset => {
            const d = new Date(date);
            d.setDate(d.getDate() + offset);
            return d.toISOString().slice(0, 10);
          });
          const batches = await Promise.all(
            dates.map(d => getScreeningsByDate(d))
          );
          raw = batches.flat();
        }

        // 2) Salong-lookup
        const salons = await getSalons();
        const salonMap = salons.reduce((acc, s) => {
          const id = s.salon_id ?? s.id;
          const name = s.salon_name ?? s.name;
          acc[id] = name;
          return acc;
        }, {});

        // 3) Berika per-screening med salong + sätesinfo + redan medskickad movie_title
        const enriched = await Promise.all(
          raw.map(async s => {
            // Seats
            const seats = await getAvailableSeats(s.screening_id);
            const totalSeats = seats.length;
            const availableSeats = seats.filter(x => x.available).length;

            return {
              ...s,
              salon_name: salonMap[s.salon_id] || "Okänd salong",
              movie_title: s.movie_title || "Okänd film",
              totalSeats,
              availableSeats,
            };
          })
        );

        // 4) Sortera på tid och spara
        enriched.sort(
          (a, b) => new Date(a.screening_time) - new Date(b.screening_time)
        );
        setScreenings(enriched);
      } catch (err) {
        setError(err.message || "Ett fel uppstod vid hämtning av visningar.");
        setScreenings([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [date, isCustom]);

  return { screenings, loading, error };
}
