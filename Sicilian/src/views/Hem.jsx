// Hem.js
import React, { useState, useEffect } from "react";
import { getMovies } from "../api/apiMovies";
import { MovieCard } from "../components/MovieCards";

export const Hem = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMovies()
      .then(data => {
        setMovies(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || "Något gick fel");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Laddar filmer...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Alla Filmer</h1>
      <div className="movie-cards-container">
        {movies.map(movie => (
          <MovieCard key={movie.movie_id} movie={movie} 
            movieTrailerId={movie.movieTrailerId} // Pass the movierTailerId to the MovieCard--Added by Maricel
          />
        ))}
      </div>
    </div>
  );
};
