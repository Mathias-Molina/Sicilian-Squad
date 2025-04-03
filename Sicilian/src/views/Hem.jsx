import React, { useState, useEffect } from 'react';
import { getMovies } from '../api/apiMovies';
import { MovieCard } from '../components/MovieCards';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

export const Hem = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const isAdmin = user?.isLoggedIn && user?.role === 'admin'; //denna rad kan behöva kontrolleras utifrån vår usercontext

  useEffect(() => {
    getMovies()
      .then(data => {
        setMovies(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Något gick fel');
        setLoading(false);
      });
  }, []);

  const handleDelete = movieId => {
    deleteMovie(movieId); //Här kan vi behöva kolla upp API-metoden/koden om det behöver läggas tll mer
  };

  const handleAddMovie = () => {
    navigate('/addmovie'); //Vad är URL för att addera?
  };

  if (loading) return <div>Laddar filmer...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Alla Filmer</h1>

      {isAdmin && (
        <button onClick={handleAddMovie} className='admin-add-button'>
          Lägg till film
        </button>
      )}

      <div className='movie-cards-container'>
        {movies.map(movie => (
          <div key={movie.movie_id} className='movie-card-wrapper'>
            <MovieCard movie={movie} />
            {isAdmin && (
              <button
                className='delete-button'
                onClick={() => handleDelete(movie.movie_id)}
              >
                ❌
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
