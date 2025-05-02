import { useState, useEffect, useCallback } from "react";
import { getScreeningsByDate } from "../api/apiScreenings";
import { getAvailableSeats } from "../api/apiSeats";
import { getSalons } from "../api/apiSalons";

export const useScreeningsData = (date, isCustom) => {
  const [screenings, setScreenings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
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

      const salons = await getSalons();
      const salonMap = salons.reduce((acc, s) => {
        const id = s.salon_id ?? s.id;
        acc[id] = s.salon_name ?? s.name;
        return acc;
      }, {});

      const enriched = await Promise.all(
        raw.map(async s => {
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
  }, [date, isCustom]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    window.addEventListener("screeningAdded", fetchData);
    return () => {
      window.removeEventListener("screeningAdded", fetchData);
    };
  }, [fetchData]);

  return { screenings, loading, error, refetch: fetchData };
};
