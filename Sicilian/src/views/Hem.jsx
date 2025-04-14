import { useState, useEffect, useContext } from "react";
import { getMovies, deleteMovie } from "../api/apiMovies";
import { MovieCard } from "../components/MovieCards";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { ConfirmDialog } from "../components/ConfirmDialog"; //maricel

export const Hem = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [movieToDelete, setMovieToDelete] = useState(null); //maricel

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

  {/*const handleDelete = async (movieId) => {
    if (!user?.user_admin) {
      setError("Du måste vara admin för att kunna radera filmer");
      return;
    }
    try {
      await deleteMovie(movieId);
      getMovies().then((data) => setMovies(data));
    } catch (err) {
      setError(err.message || "Något gick fel");
    }
  };*/}
  const confirmDelete = (movieId) => {
    if (!user?.user_admin) {
      setError("Du måste vara admin för att kunna radera filmer");
      return;
    }
    const movie = movies.find((m) => Number(m.movie_id) === Number(movieId));
    setMovieToDelete(movie);

  };
  const handleConfirm = async () => {
    try {
      await deleteMovie(movieToDelete.movie_id);
      const updatedMovies = await getMovies();
      setMovies(updatedMovies);
    } catch (err) {
      setError(err.message || "Något gick fel");
    } finally {
      setMovieToDelete(null);
    }
  };

  const handleCancel = () => {
    setMovieToDelete(null);
  };


  const handleAddMovie = () => {
    navigate("/addmovie");
  };

  if (loading) return <div>Laddar filmer...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Aktuella filmer</h1>
      {user && user.user_admin === 1 && (
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
      <div className="movie-cards-container">
        {movies.map((movie) => (
          <div key={movie.movie_id} className="movie-card-wrapper">
            <MovieCard movie={movie} />
            {user && user.user_admin === 1 && (
              <button
                className="delete-button"
                onClick={() => confirmDelete(movie.movie_id)}
              >
                ❌
              </button>
            )}
          </div>
        ))}
      </div>
      {/* Add this here --Maricel */}
      {movieToDelete && (
        <ConfirmDialog
          message={`Are you sure you want to delete the film "${movieToDelete.movie_title}"?`}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};
