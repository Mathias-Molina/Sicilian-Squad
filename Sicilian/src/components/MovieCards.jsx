import { Link } from 'react-router-dom';

export const MovieCard = ({ movie, movieTrailerId }) => { // Pass the movieTrailerId as a prop--Maricel
  return (
    <Link to={`/movies/${movie.movie_id}`} className="movie-card__link">
      <div className="movie-card">
        <img
          src={movie.movie_poster}
          alt={movie.movie_title}
          className="movie-card__image"
          style={{ width: '200px' }}
        />
        <div className="movie-card__info">
          <h2 className="movie-card__title">{movie.movie_title}</h2>
          <p className="movie-card__description">{movie.movie_description}</p>
          <p className="movie-card__genre">Genre: {movie.movie_genre}</p>
          <p className="movie-card__rating">Betyg: {movie.movie_rated}</p>
          <p className="movie-card__runtime">Speltid: {movie.movie_runtime}</p>
          <p className="movie-card__releaseDate">Released: {movie.movie_releaseDate}</p>

          {movieTrailerId && ( // Check if movieTailerId is available, Added by Maricel, 
            <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "3git chec0px" }}> 
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${movieTrailerId}`}
                title={`${movie.movie_title} Trailer`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}

        </div>
      </div>
    </Link>
  );
};
