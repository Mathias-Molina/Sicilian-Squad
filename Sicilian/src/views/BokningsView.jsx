import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getSalons } from "../api/apiSalons";

export const BokningsView = () => {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getSalons()
      .then(data => {
        setSalons(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || "Fel vid hämtning av salonger");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Laddar salonger...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section>
      <h1>Bokning</h1>
      <p>Välj en biosalong:</p>
      <div className="salon-list">
        {salons.map(salon => (
          <Link key={salon.salon_id} to={`/boka/salongs/${salon.salon_id}`}>
            <button>{salon.salon_name}</button>
          </Link>
        ))}
      </div>
    </section>
  );
};
