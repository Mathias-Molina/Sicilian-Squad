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
    <section className="movie-details-container">
      <div className="movie-content">
        <div className="poster-container">
          <img
            src={movie.movie_poster}
            alt={movie.movie_title}
            className="movie-poster"
          />
          <Link to={`/boka/${movie.movie_id}`} className="book-button">
            Boka film
          </Link>
        </div>
        
        <div className="movie-details">
          <h1 className="movie-title">{movie.movie_title}</h1>
          
          {videoId && (
            <div className="trailer-section">
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

          <p className="movie-description">{movie.movie_description}</p>
          
          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">Genre</div>
              <div className="info-value">{movie.movie_genre}</div>
            </div>
            
            <div className="info-item">
              <div className="info-label">Betyg</div>
              <div className="info-value">{movie.movie_rated}</div>
            </div>

            <div className="info-item">
              <div className="info-label">Speltid</div>
              <div className="info-value">{movie.movie_runtime}</div>
            </div>
            
            <div className="info-item">
              <div className="info-label">Released</div>
              <div className="info-value">{movie.movie_releaseDate}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
