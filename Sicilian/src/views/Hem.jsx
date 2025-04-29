import { useState, useEffect, useContext } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { getMovies, deleteMovie } from "../api/apiMovies";
import { MovieCard } from "../components/MovieCards";
import { MovieFilter } from "../components/MovieFilter";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { ConfirmDialog } from "../components/ConfirmDialog";

export const Hem = () => {
  const [movies, setMovies] = useState([]);
  const [filters, setFilters] = useState({ genres: [], actors: [], age: "" });
  const debouncedFilters = useDebounce(filters, 500);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [movieToDelete, setMovieToDelete] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError("");

    const params = new URLSearchParams();
    if (debouncedFilters.genres.length)
      params.append("genres", debouncedFilters.genres.join(","));
    if (debouncedFilters.actors.length)
      params.append("actors", debouncedFilters.actors.join(","));
    if (debouncedFilters.age) params.append("age", debouncedFilters.age);

    const query = params.toString() ? `?${params.toString()}` : "";

    getMovies(query)
      .then(data => setMovies(data))
      .catch(e => setError(e.message || "Något gick fel"))
      .finally(() => setLoading(false));
  }, [debouncedFilters]);

  const confirmDelete = movieId => {
    if (!user?.user_admin) {
      setError("Du måste vara admin för att kunna radera filmer");
      return;
    }
    const movie = movies.find(m => Number(m.movie_id) === Number(movieId));
    setMovieToDelete(movie);
  };

  const handleConfirm = async () => {
    try {
      await deleteMovie(movieToDelete.movie_id);
      setFilters(prev => ({ ...prev }));
    } catch (err) {
      setError(err.message || "Något gick fel");
    } finally {
      setMovieToDelete(null);
    }
  };

  const handleCancel = () => setMovieToDelete(null);
  const handleAddMovie = () => navigate("/addmovie");

  return (
    <div>
      <h1 className="section-heading">Aktuella filmer</h1>

      <MovieFilter onChange={setFilters} />

      {user?.user_admin === 1 && (
        <div>
          <button onClick={handleAddMovie} className="admin-add-button">
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

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div>Laddar filmer...</div>
      ) : (
        <div className="movie-cards-container">
          {movies.map(movie => (
            <div key={movie.movie_id} className="movie-card">
              {user?.user_admin === 1 && (
                <div className="admin-controls">
                  <button
                    className="delete-button"
                    onClick={() => confirmDelete(movie.movie_id)}
                  >
                    ❌
                  </button>
                </div>
              )}
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      )}

      {/* Bekräfta-rutor för radering */}
      {movieToDelete && (
        <ConfirmDialog
          message={`Är du säker på att ta bort "${movieToDelete.movie_title}"?`}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};
