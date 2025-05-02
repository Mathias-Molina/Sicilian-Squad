import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getScreenings } from "../api/apiScreenings";
import { getAvailableSeats } from "../api/apiSeats";
import { StepIndicator } from "../components/StepIndicator";

export function SelectScreeningView() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [screeningList, setScreeningList] = useState([]);
  const [seatAvailabilityMap, setSeatAvailabilityMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const all = await getScreenings(movieId);
        const now = new Date();
        const future = all
          .filter(s => new Date(s.screening_time) > now)
          .sort(
            (a, b) => new Date(a.screening_time) - new Date(b.screening_time)
          );

        const availabilityArr = await Promise.all(
          future.map(async s => {
            const seats = await getAvailableSeats(s.screening_id);
            const total = seats.length;
            const available = seats.filter(seat => seat.available).length;
            return { screeningId: s.screening_id, available, total };
          })
        );

        const availabilityObj = availabilityArr.reduce((acc, cur) => {
          acc[cur.screeningId] = { available: cur.available, total: cur.total };
          return acc;
        }, {});

        setScreeningList(future);
        setSeatAvailabilityMap(availabilityObj);
      } catch (err) {
        setErrorMessage(
          err.message || "Ett fel uppstod vid hämtning av visningar."
        );
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [movieId]);

  const handleClick = (screeningId, salonId) => {
    navigate(`/boka/screening/${screeningId}/${salonId}`);
  };

  if (isLoading) return <div>Laddar visningar...</div>;
  if (errorMessage)
    return <div className="error-message">Fel: {errorMessage}</div>;

  return (
    <section className="screening-section">
      <StepIndicator currentStep={1} />
      <h1 className="section-title">Välj visning</h1>

      {screeningList.length === 0 ? (
        <p>Inga kommande visningar tillgängliga.</p>
      ) : (
        <ul className="screening-list">
          {screeningList.map(s => {
            const avail = seatAvailabilityMap[s.screening_id] || {
              available: 0,
              total: 0,
            };
            const { available, total } = avail;
            const percent = total ? (available / total) * 100 : 0;

            // Text och klass
            const text =
              available === 0
                ? "Fullbokad"
                : `Lediga platser: ${available} av ${total}`;

            let cls = "high-availability";
            if (available === 0) cls = "fullbooked-availability";
            else if (percent < 30) cls = "low-availability";
            else if (percent < 70) cls = "medium-availability";

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
                    <p className={`seat-info ${cls}`}>{text}</p>
                    <button
                      className="select-button"
                      onClick={() => handleClick(s.screening_id, s.salon_id)}
                      disabled={available === 0}
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
}
