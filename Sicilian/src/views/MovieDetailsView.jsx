import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getMovieById } from "../api/apiMovies";

export const MovieDetailsView = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMovieById(movieId)
      .then(data => {
        setMovie(data);
      })
      .catch(err => {
        setError(err);
      });
  }, [movieId]);

  if (error) return <div>Fel: {error.message || "Något gick fel"}</div>;
  if (!movie) return <div>Laddar...</div>;

  return (
    <section>
      <h1>{movie.movie_title}</h1>
      <img
        src={movie.movie_poster}
        alt={movie.movie_title}
        style={{ width: "300px" }}
      />
      <p>{movie.movie_description}</p>
      <p>
        <strong>Genre:</strong> {movie.movie_genre}
      </p>
      <p>
        <strong>Betyg:</strong> {movie.movie_rated}
      </p>
      <p>
        <strong>Speltid:</strong> {movie.movie_runtime}
      </p>
      <p>
        <strong>Released:</strong> {movie.movie_releaseDate}
      </p>
    </section>
  );
};
