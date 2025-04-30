import { useState, useEffect } from "react";
import { getScreeningsByDate } from "../api/apiScreenings";
import { getAvailableSeats } from "../api/apiSeats";
import { useNavigate } from "react-router-dom";

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
        // 1) Hämta visningar
        let data = [];
        if (isCustom) {
          data = await getScreeningsByDate(date);
        } else {
          const dates = [0, 1, 2].map(offset => {
            const d = new Date(date);
            d.setDate(d.getDate() + offset);
            return d.toISOString().slice(0, 10);
          });
          const results = await Promise.all(
            dates.map(d => getScreeningsByDate(d))
          );
          data = results.flat();
        }
        // Sortera på tid
        data.sort(
          (a, b) => new Date(a.screening_time) - new Date(b.screening_time)
        );
        setScreenings(data);

        // 2) Hämta sätes-tillgänglighet parallellt
        const availabilityArray = await Promise.all(
          data.map(async s => {
            const seats = await getAvailableSeats(s.screening_id);
            const totalSeats = seats.length;
            const availableSeats = seats.filter(seat => seat.available).length;
            return {
              screeningId: s.screening_id,
              availableSeats,
              totalSeats,
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
            const avail = seatAvailabilityMap[s.screening_id] || {};
            const availableSeats = avail.availableSeats ?? 0;
            const totalSeats = avail.totalSeats ?? 0;
            const percent = totalSeats
              ? (availableSeats / totalSeats) * 100
              : 0;

            // Sätt text och klass: fullbokad om inga platser kvar
            const availabilityText =
              availableSeats === 0
                ? "Fullbokad"
                : `Lediga platser: ${availableSeats} av ${totalSeats}`;

            let availabilityClass = "high-availability";
            if (availableSeats === 0) {
              availabilityClass = "fullbooked-availability";
            } else if (percent < 30) {
              availabilityClass = "low-availability";
            } else if (percent < 70) {
              availabilityClass = "medium-availability";
            }

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
                    <p className="screening-salon">{s.salon_name}</p>
                  </div>
                  <div className="screening-availability">
                    <p className={`seat-info ${availabilityClass}`}>
                      {availabilityText}
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
