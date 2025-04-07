import { useState, useEffect } from "react";
import { getScreenings } from "../api/apiScreenings";
import { useParams, useNavigate } from "react-router-dom";

export const SelectScreeningView = () => {
  const { salonId } = useParams();
  const [screenings, setScreenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getScreenings()
      .then(data => {
        // Filtrera de visningar som hör till den valda salongen
        const filtered = data.filter(
          screening => screening.salon_id === parseInt(salonId)
        );
        setScreenings(filtered);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || "Fel vid hämtning av visningar");
        setLoading(false);
      });
  }, [salonId]);

  const handleSelectScreening = screeningId => {
    navigate(`/boka/screening/${screeningId}`);
  };

  if (loading) return <div>Laddar visningar...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section>
      <h1>Välj visning för film på salong {salonId}</h1>
      <ul>
        {screenings.map(screening => (
          <li key={screening.screening_id}>
            <button
              onClick={() => handleSelectScreening(screening.screening_id)}
            >
              {new Date(screening.screening_time).toLocaleString()}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};
