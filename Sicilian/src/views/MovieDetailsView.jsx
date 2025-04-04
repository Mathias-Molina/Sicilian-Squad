import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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


  const videoId = movie.movie_trailer; //  Fetching from database --Maricel--

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

      {/* 🎬 Trailer section */}             //---Maricel--
      {videoId && (
        <div style={{ marginTop: "20px" }}>
          <h3>Trailer:</h3>
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}

      <Link to="/boka">
        <button>Boka film</button>
      </Link>
    </section>
  );
};
