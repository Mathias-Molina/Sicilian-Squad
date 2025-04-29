import { useState, useEffect } from "react";
import { getScreeningsByDate } from "../api/apiScreenings";
import { useNavigate } from "react-router-dom";

export const ScreeningComponent = () => {
  const navigate = useNavigate();

  // Dagens datum i YYYY-MM-DD
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);

  // Är vi i custom-läge (endast valt datum)?
  const [isCustom, setIsCustom] = useState(false);

  const [screenings, setScreenings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        let data = [];

        if (isCustom) {
          // Custom: bara valet datum
          data = await getScreeningsByDate(date);
        } else {
          // Standard: tre dagar från 'date'
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

        // Sortera oavsett
        data.sort(
          (a, b) => new Date(a.screening_time) - new Date(b.screening_time)
        );

        setScreenings(data);
      } catch (err) {
        setError(err.message || "Ett fel uppstod vid hämtning av visningar.");
        setScreenings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date, isCustom]);

  const handleChangeDate = e => {
    setDate(e.target.value);
    setIsCustom(true); // slår på custom‐läge
  };

  const handleClick = (screeningId, salonId) => {
    navigate(`/boka/screening/${screeningId}/${salonId}`);
  };

  return (
    <div>
      <h1>Visningar de närmaste tre dagarna</h1>

      {/* Hjälp­text för kalendern */}
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

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div>Laddar visningar...</div>
      ) : screenings.length === 0 ? (
        <p>
          {isCustom
            ? "Inga visningar det datumet."
            : "Inga visningar de närmaste tre dagarna."}
        </p>
      ) : (
        <ul className="screening-list">
          {screenings.map(s => (
            <li
              key={s.screening_id}
              className="screening-item"
              onClick={() => handleClick(s.screening_id, s.salon_id)}
              style={{ cursor: "pointer" }}
            >
              <div>
                <strong>
                  {new Date(s.screening_time).toLocaleDateString()}{" "}
                  {new Date(s.screening_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </strong>{" "}
                – Salong {s.salon_id}
              </div>
              <div>{s.movie_title}</div>
              <div>{s.screening_price} kr</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
