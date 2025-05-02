import { useState, useEffect } from "react";
import { addScreenings } from "../api/apiScreenings";
import { getMovies } from "../api/apiMovies";
import { getSalons } from "../api/apiSalons";

export const AddScreening = () => {
  const [movie, setMovie] = useState(undefined);
  const [salon, setSalon] = useState(undefined);
  const [screeningTime, setScreeningTime] = useState("");
  const [screeningPrice, setScreeningPrice] = useState(0);
  const [movies, setMovies] = useState(null);
  const [salons, setSalons] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // Fetch movies
  useEffect(() => {
    getMovies()
      .then(data => setMovies(data))
      .catch(err =>
        setError(err.message || "Något gick fel vid hämtning av filmer")
      )
      .finally(() => setLoading(false));
  }, []);

  // Fetch salons
  useEffect(() => {
    getSalons()
      .then(data => setSalons(data))
      .catch(err =>
        setError(err.message || "Något gick fel vid hämtning av salonger")
      )
      .finally(() => setLoading(false));
  }, []);

  const handleAddScreening = async e => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!movie || !salon || !screeningTime || !screeningPrice) {
      return setError("Alla fält är obligatoriska");
    }

    // Format "YYYY-MM-DDTHH:mm" to "YYYY-MM-DD HH:mm:00"
    const [datePart, timePart] = screeningTime.split("T");
    const timeWithSeconds = timePart.length === 5 ? `${timePart}:00` : timePart;
    const formattedTime = `${datePart} ${timeWithSeconds}`;

    try {
      const response = await addScreenings(
        movie.movie_id,
        salon.salon_id,
        formattedTime,
        Number(screeningPrice)
      );

      setMessage(
        `${response.message}: ${movie.movie_title} i salong ${salon.salon_name} kl ${formattedTime} för ${screeningPrice} KR`
      );
      setMovie(undefined);
      setSalon(undefined);
      setScreeningTime("");
      setScreeningPrice(0);

      // Dispatch event to refresh screening lists
      window.dispatchEvent(new Event("screeningAdded"));
    } catch (err) {
      setError(err.message || "Något gick fel vid tillägg av visning");
    }
  };

  return (
    <div className="add-screening-container">
      <h2>Lägg till visning</h2>
      {loading && <p>Laddar...</p>}
      {!loading && (
        <>
          <div className="selection-section">
            <h3>Välj en film</h3>
            <ul className="movie-list">
              {movies?.map(m => (
                <li
                  key={m.movie_id}
                  className={`movie-item ${
                    movie?.movie_id === m.movie_id ? "selected" : ""
                  }`}
                  onClick={() => setMovie(m)}
                >
                  <img
                    src={m.movie_poster}
                    alt={m.movie_title}
                    className="movie-poster-add-screening"
                  />
                  <span>{m.movie_title}</span>
                </li>
              ))}
            </ul>
            <h3>Välj en salong</h3>
            <ul className="salon-list">
              {salons?.map((s, idx) => (
                <li
                  key={s.salon_id}
                  className={`salon-item ${
                    idx === 0 ? "salon-primary" : "salon-secondary"
                  } ${salon?.salon_id === s.salon_id ? "selected" : ""}`}
                  onClick={() => setSalon(s)}
                >
                  {s.salon_name}
                </li>
              ))}
            </ul>
          </div>

          <hr />
          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}

          <form className="add-screening-form" onSubmit={handleAddScreening}>
            <div className="selection-container">
              <p>
                🎬 Vald Film:{" "}
                <strong>{movie?.movie_title || "Ingen vald"}</strong>
              </p>
              <p>
                🏛️ Vald Salong:{" "}
                <strong>{salon?.salon_name || "Ingen vald"}</strong>
              </p>
            </div>

            <div className="input-group">
              <label>Visningsdatum</label>
              <input
                type="datetime-local"
                value={screeningTime}
                onChange={e => setScreeningTime(e.target.value)}
              />

              <label>Biljettpris (KR)</label>
              <input
                type="number"
                min="0"
                value={screeningPrice}
                onChange={e => setScreeningPrice(e.target.value)}
              />
            </div>

            <button type="submit" className="submit-button">
              Lägg till visning
            </button>
          </form>
        </>
      )}
    </div>
  );
};
