import { useState, useEffect, useContext } from "react";
import { getMovies, deleteMovie } from "../api/apiMovies";
import { MovieCard } from "../components/MovieCards";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { LoadingSkeleton } from "../components/LoadingSkeleton";

export const Hem = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [movieToDelete, setMovieToDelete] = useState(null);

  // Minsta skeleton-vistelse
  const [minDelayPassed, setMinDelayPassed] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setMinDelayPassed(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    getMovies()
      .then((data) => setMovies(data))
      .catch((err) => setError(err.message || "Något gick fel"))
      .finally(() => setLoading(false));
  }, []);

  // Visa skeleton tills både data laddat och min-delay gått
  if (loading || !minDelayPassed) {
    return (
      <div className="movie-cards-container">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="movie-card">
            <LoadingSkeleton height="200px" style={{ marginBottom: "1rem" }} />
            <LoadingSkeleton width="60%" height="1.2rem" />
            <LoadingSkeleton width="40%" height="1rem" />
          </div>
        ))}
      </div>
    );
  }

  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Aktuella filmer</h1>
      {user && user.user_admin === 1 && (
        <div>
          <button
            onClick={() => navigate("/addmovie")}
            className="admin-add-button"
          >
            Lägg till film
          </button>
          <button
            onClick={() => navigate("/screening/add")}
            className="admin-add-button"
          >
            Lägg till visning
          </button>
        </div>
      )}
      <div className="movie-cards-container">
        {movies.map((movie) => (
          <div key={movie.movie_id} className="movie-card">
            {user && user.user_admin === 1 && (
              <div className="admin-controls">
                <button
                  className="delete-button"
                  onClick={() => setMovieToDelete(movie)}
                >
                  ❌
                </button>
              </div>
            )}
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
      {movieToDelete && (
        <ConfirmDialog
          message={`Vill du verkligen ta bort "${movieToDelete.movie_title}"?`}
          onConfirm={async () => {
            try {
              await deleteMovie(movieToDelete.movie_id);
              setMovies(await getMovies());
            } catch (e) {
              setError(e.message || "Fel vid borttagning");
            } finally {
              setMovieToDelete(null);
            }
          }}
          onCancel={() => setMovieToDelete(null)}
        />
      )}
    </div>
  );
};
