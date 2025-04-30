import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getScreeningsByDate } from "../api/apiScreenings";
import { getAvailableSeats } from "../api/apiSeats";
import { getSalons } from "../api/apiSalons";

export const ScreeningComponent = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);

  const [date, setDate] = useState(today);
  const [isCustom, setIsCustom] = useState(false);
  const [screenings, setScreenings] = useState([]);
  const [seatAvailabilityMap, setSeatAvailabilityMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        // 1) Hämta alla relevanta visningar
        let rawData = [];
        if (isCustom) {
          rawData = await getScreeningsByDate(date);
        } else {
          const dates = [0, 1, 2].map(offset => {
            const d = new Date(date);
            d.setDate(d.getDate() + offset);
            return d.toISOString().slice(0, 10);
          });
          const results = await Promise.all(
            dates.map(d => getScreeningsByDate(d))
          );
          rawData = results.flat();
        }

        const salons = await getSalons();
        const salonMap = salons.reduce((acc, salon) => {
          acc[salon.salon_id ?? salon.id] =
            salon.salon_name ?? salon.name ?? "Okänd salong";
          return acc;
        }, {});

        // 3) Blanda in salon_name i varje visning
        const enriched = rawData.map(s => ({
          ...s,
          salon_name: salonMap[s.salon_id] || "Okänd salong",
        }));

        // 4) Sortera på tid
        enriched.sort(
          (a, b) => new Date(a.screening_time) - new Date(b.screening_time)
        );
        setScreenings(enriched);

        // 5) Hämta sätes-availability parallellt
        const availabilityArray = await Promise.all(
          enriched.map(async s => {
            const seats = await getAvailableSeats(s.screening_id);
            return {
              screeningId: s.screening_id,
              totalSeats: seats.length,
              availableSeats: seats.filter(seat => seat.available).length,
            };
          })
        );
        const availabilityMap = availabilityArray.reduce((acc, cur) => {
          acc[cur.screeningId] = {
            availableSeats: cur.availableSeats,
            totalSeats: cur.totalSeats,
          };
          return acc;
        }, {});
        setSeatAvailabilityMap(availabilityMap);
      } catch (err) {
        setError(err.message || "Ett fel uppstod vid hämtning av visningar.");
        setScreenings([]);
        setSeatAvailabilityMap({});
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date, isCustom]);

  const handleChangeDate = e => {
    setDate(e.target.value);
    setIsCustom(true);
  };

  const handleClick = (screeningId, salonId) => {
    navigate(`/boka/screening/${screeningId}/${salonId}`);
  };

  return (
    <section className="screening-section">
      <h1 className="section-title">Visningar de närmaste tre dagarna</h1>

      <div className="date-picker-wrapper">
        <label htmlFor="screening-date" className="date-picker-label">
          Välj datum för visningar att boka:
        </label>
        <input
          id="screening-date"
          type="date"
          value={date}
          min={today}
          onChange={handleChangeDate}
          className="date-picker-input"
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-message">Laddar visningar…</div>
      ) : screenings.length === 0 ? (
        <p className="no-screenings">
          {isCustom
            ? "Inga visningar det datumet."
            : "Inga visningar de närmaste tre dagarna."}
        </p>
      ) : (
        <ul className="screening-list">
          {screenings.map(s => {
            const dt = new Date(s.screening_time);
            const dateStr = dt.toLocaleDateString();
            const timeStr = dt.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            const { availableSeats = null, totalSeats = null } =
              seatAvailabilityMap[s.screening_id] || {};
            const percent = totalSeats
              ? (availableSeats / totalSeats) * 100
              : 0;

            // Sätt text och klass: fullbokad om inga platser kvar
            const availabilityText =
              availableSeats === 0
                ? "Fullbokad"
                : `Lediga platser: ${availableSeats} av ${totalSeats}`;

            let availabilityClass = "high-availability";
            if (percent < 30) availabilityClass = "low-availability";
            else if (percent < 70) availabilityClass = "medium-availability";

            return (
              <li key={s.screening_id} className="screening-item">
                <div className="screening-content">
                  <div className="screening-info">
                    <p className="screening-time">
                      {new Date(s.screening_time).toLocaleDateString()} •{" "}
                      {new Date(s.screening_time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {/* Här dyker salongsnamnet upp precis som i SelectScreeningView */}
                    <p className="screening-salon">{s.salon_name}</p>
                  </div>

                  <div className="screening-availability">
                    <p className={`seat-info ${availabilityClass}`}>
                      {availableSeats != null
                        ? `Lediga platser: ${availableSeats} av ${totalSeats}`
                        : "Laddar lediga platser…"}
                    </p>
                    <button
                      className="select-button"
                      onClick={() => handleClick(s.screening_id, s.salon_id)}
                      disabled={availableSeats === 0}
                    >
                      Välj visning
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};
