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
      setError(err);
    }
  };

  return (
    <div>
      {(error && (error.message || error)) || null}
      {message && message}
      <form
        onSubmit={(e) =>
          handleAddScreening(e, movie, salon, screeningTime, screeningPrice)
        }
      >
        <p>{`Chosen movie: ${movie ? movie.movie_title : ""}`}</p>
        <p>{`Chosen salon: ${salon ? salon.salon_name : ""}`}</p>
        <input
          type="datetime-local"
          placeholder="screening_time"
          value={screeningTime}
          onChange={(e) => setScreeningTime(e.target.value)}
        />
        <label>Ticket Price</label>
        <input
          type="number"
          placeholder="price"
          value={screeningPrice}
          onChange={(e) => setScreeningPrice(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      <ul>
        {movies &&
          movies.map((movie) => (
            <div key={movie.movie_id} onClick={() => setMovie(movie)}>
              {movie.movie_title}
              <img
                src={movie.movie_poster}
                alt={movie.movie_title}
                width={"40px"}
              />
            </div>
          ))}
      </ul>
      {salons &&
        salons.map((salon) => (
          <div key={salon.salon_id} onClick={() => setSalon(salon)}>
            {salon.salon_name}
          </div>
        ))}
    </div>
  );
};
