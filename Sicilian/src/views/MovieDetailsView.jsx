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
    <div className="movie-details-container">
      <div className="movie-poster-section">
        <img
          src={movie.movie_poster}
          alt={movie.movie_title}
          className="movie-poster"
        />
        <Link to={`/boka/${movie.movie_id}`}>
          <button className="book-button">Boka film</button>
        </Link>
      </div>

      <div className="movie-info-section">
        <h1>{movie.movie_title}</h1>

        {videoId && (
          <div className="trailer-container">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        <div className="movie-description">{movie.movie_description}</div>

        <div className="movie-metadata-grid">
          <div className="metadata-block">
            <h3>Genre</h3>
            <p>{movie.movie_genre}</p>
          </div>
          <div className="metadata-block">
            <h3>Åldersgräns</h3>
            <p>{movie.movie_rated}</p>
          </div>
          <div className="metadata-block">
            <h3>Speltid</h3>
            <p>{movie.movie_runtime}</p>
          </div>
          <div className="metadata-block">
            <h3>Premiärdatum</h3>
            <p>{movie.movie_releaseDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
