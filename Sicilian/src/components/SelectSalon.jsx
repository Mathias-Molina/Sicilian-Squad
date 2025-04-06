import { useState, useEffect } from 'react';
import { getSalons } from '../api/apiSalons';
import { useNavigate } from 'react-router-dom';

export const SelectSalon = () => {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getSalons()
      .then(data => {
        setSalons(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Fel vid hämtning av salonger');
        setLoading(false);
      });
  }, []);

  const handleSelectSalon = (salonId) => {
    navigate(`/boka/salongs/${salonId}`);
  };

  if (loading) return <div>Laddar salonger...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section>
      <h1>Välj biosalong</h1>
      <ul>
        {salons.map(salon => (
          <li key={salon.salon_id}>
            <button onClick={() => handleSelectSalon(salon.salon_id)}>
              {salon.salon_name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};
