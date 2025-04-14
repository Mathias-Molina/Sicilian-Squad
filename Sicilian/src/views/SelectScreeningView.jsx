import { useState, useEffect } from "react";
import { getScreenings } from "../api/apiScreenings";
import { useParams, useNavigate } from "react-router-dom";

export const SelectScreeningView = () => {
  const { salonId, movieId } = useParams();
  const [screenings, setScreenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getScreenings(movieId)
      .then((data) => {
        setScreenings(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Fel vid hämtning av visningar");
        setLoading(false);
      });
  }, [salonId]);

  const handleSelectScreening = (screeningId, salonId) => {
    navigate(`/boka/screening/${screeningId}/${salonId}`);
  };

  if (loading) return <div>Laddar visningar...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section>
      <h1>Välj visning för film på salong {salonId}</h1>
      <ul>
        {screenings.map((screening) => (
          <li key={screening.screening_id}>
            <button
              onClick={() =>
                handleSelectScreening(
                  screening.screening_id,
                  screening.salon_id
                )
              }
            >
              {`${new Date(screening.screening_time).toLocaleString()} ${
                screening.salon_name
              } ${screening.movie_title}`}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};
