import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getMovieById } from "../api/apiMovies";

export const MovieDetailsView = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMovieById(movieId)
      .then((data) => {
        setMovie(data);
      })
      .catch((err) => {
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
        
        <div className="movie-description">
          {movie.movie_description}
        </div>

        <div className="movie-metadata">
          <div className="metadata-item">
            <span className="label">Genre:</span>
            <span className="value">{movie.movie_genre}</span>
          </div>
          <div className="metadata-item">
            <span className="label">Betyg:</span>
            <span className="value">{movie.movie_rated}</span>
          </div>
          <div className="metadata-item">
            <span className="label">Speltid:</span>
            <span className="value">{movie.movie_runtime}</span>
          </div>
          <div className="metadata-item">
            <span className="label">Released:</span>
            <span className="value">{movie.movie_releaseDate}</span>
          </div>
        </div>

        {videoId && (
          <div className="trailer-section">
            <h2>Trailer</h2>
            <div className="trailer-container">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
