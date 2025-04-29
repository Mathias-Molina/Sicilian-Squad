import { useState, useEffect, useContext } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { getMovies, deleteMovie } from "../api/apiMovies";
import { MovieCard } from "../components/MovieCards";
import { MovieFilter } from "../components/MovieFilter";
import { FlipView } from "../components/FlipView";
import { ScreeningComponent } from "../components/ScreeningComponent";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { ConfirmDialog } from "../components/ConfirmDialog";

export const Hem = () => {
  const [flipped, setFlipped] = useState(false);
  const [movies, setMovies] = useState([]);
  const [filters, setFilters] = useState({ genres: [], actors: [], age: "" });
  const debouncedFilters = useDebounce(filters, 300);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [movieToDelete, setMovieToDelete] = useState(null);

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // Hämta filmer så länge vi inte är flipped
  useEffect(() => {
    if (flipped) return;
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
  }, [debouncedFilters, flipped]);

  // --- Admin-funktioner för radering ---
  const confirmDelete = movieId => {
    if (!user?.user_admin) {
      setError("Du måste vara admin för att kunna radera filmer");
      return;
    }
    const m = movies.find(m => Number(m.movie_id) === Number(movieId));
    setMovieToDelete(m || null);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteMovie(movieToDelete.movie_id);
      // trigga uppdatering genom att t.ex. köra om effekten:
      setFilters(f => ({ ...f }));
    } catch (err) {
      setError(err.message || "Något gick fel vid radering");
    } finally {
      setMovieToDelete(null);
    }
  };

  const handleCancelDelete = () => setMovieToDelete(null);

  // --- Front-panel (filmer + filter + admin + knapp till visningar) ---
  const front = (
    <div>
      <h1 className="section-heading">Aktuella filmer</h1>

      {/* Admin-knappar */}
      {user?.user_admin === 1 && (
        <div style={{ marginBottom: "1rem" }}>
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

      <div className="toolbar" style={{ display: "flex", gap: "1rem" }}>
        <MovieFilter onChange={setFilters} />
        <button onClick={() => setFlipped(true)} className="btn-secondary">
          Se visningar
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div>Laddar filmer…</div>
      ) : (
        <div className="movie-cards-container">
          {movies.map(m => (
            <div key={m.movie_id} className="movie-card">
              {/* Radera-knapp per kort */}
              {user?.user_admin === 1 && (
                <div className="admin-controls">
                  <button
                    className="delete-button"
                    onClick={() => confirmDelete(m.movie_id)}
                  >
                    ❌
                  </button>
                </div>
              )}
              <MovieCard movie={m} />
            </div>
          ))}
        </div>
      )}

      {/* Bekräfta-dialog vid radering */}
      {movieToDelete && (
        <ConfirmDialog
          message={`Är du säker på att ta bort "${movieToDelete.movie_title}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );

  // --- Back-panel (visningar) ---
  const back = (
    <div>
      <div className="toolbar">
        <button onClick={() => setFlipped(false)} className="btn-secondary">
          Tillbaka till filmer
        </button>
      </div>
      <ScreeningComponent />
    </div>
  );

  return <FlipView flipped={flipped} front={front} back={back} />;
};
