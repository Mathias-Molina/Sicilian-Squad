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

  useEffect(() => {
    getMovies()
      .then((data) => {
        setMovies(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Något gick fel");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    getSalons()
      .then((data) => {
        setSalons(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  const handleAddScreening = async (
    e,
    movie,
    salon,
    screening_time,
    screening_price
  ) => {
    e.preventDefault();
    setMessage(null);

    if (!movie || !salon || !screening_time || !screening_price) {
      return setError("All fields required");
    }

    try {
      const response = await addScreenings(
        movie.movie_id,
        salon.salon_id,
        screening_time,
        screening_price
      );
      setMessage(
        `${response.message} ${movie.movie_title} ${salon.salon_id} ${screeningTime} ${screeningPrice}KR`
      );
      setError(null);
      setMovie(undefined);
      setSalon(undefined);
      setScreeningPrice(0);
      setScreeningTime("");

    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  };

  return (
    <div className="add-screening-container">

      <h2>Lägg till visning</h2>

      <div className="selection-section">
        <h3>Välj en film</h3>
        <ul className="movie-list">
          {movies &&
            movies.map((m) => (
              <div
                className={`movie-item ${movie && movie.movie_id === m.movie_id ? "selected" : ""}`}
                key={m.movie_id}
                onClick={() => setMovie(m)}
              >
                {m.movie_title}
                <img
                  className="movie-poster-add-screening"
                  src={m.movie_poster}
                  alt={m.movie_title}
                />
              </div>
            ))}
        </ul>
        <br />
        <h3>Välj en salong</h3>
        <ul className="salon-list"> {/* I separated the buttons into two classnames so I can style them with different colors --Maricel*/}
          {salons &&
            salons.map((s, index) => (
              <div
                className={`salon-item 
                  ${index === 0 ? "salon-primary" : "salon-secondary"} 
                  ${salon && salon.salon_id === s.salon_id ? "selected" : ""}`
                }
                key={s.salon_id}
                onClick={() => setSalon(s)}
              >
                {s.salon_name}
              </div>
            ))}
        </ul>
      </div>
      <br />
      <hr />
      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}

      <form
        className="add-screening-form"
        onSubmit={(e) =>
          handleAddScreening(e, movie, salon, screeningTime, screeningPrice)
        }
      >
        <div className="selection-container">
          <p className="selection-info">
            🎬 Vald Film: <strong>{movie ? movie.movie_title : ""}</strong>
          </p>
          <p className="selection-info">
            🏛️ Vald Salong: <strong>{salon ? salon.salon_name : ""}</strong>
          </p>
        </div>


        <div className="input-group">
          <label className="label1">Visningsdatum</label>
          <input
            className="input1"
            type="datetime-local"
            placeholder="screening_time"
            value={screeningTime}
            onChange={(e) => setScreeningTime(e.target.value)}
          />

          <label className="label2">Biljettpris</label>

          <input
            className="input2"
            type="number"
            placeholder="Pris"
            value={screeningPrice}
            onChange={(e) => setScreeningPrice(e.target.value)}
          />
        </div>

        <button className="submit-button" type="submit">Lägg film till visning</button>
      </form>
    </div>
  );
};
