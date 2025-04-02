import fetch from "node-fetch";
import { insertMovie, getAllMovies } from "../Models/movieModel.js";

export const getMovieHandler = async (req, res) => {
  const { movieName } = req.params;

  try {
    // Hämta filmdata från OMDB API
    const response = await fetch(
      `https://www.omdbapi.com/?t=${movieName}&apikey=${process.env.APIKEY}`
    );
    const data = await response.json();

    if (data.Response === "False") {
      return res.status(404).json({ error: "Filmen hittades inte" });
    }

    // Mappa OMDB-data till dina databasfält
    const title = data.Title;
    const description = data.Plot;
    const genre = data.Genre;
    const rated = data.Rated;
    const poster = data.Poster;
    const trailer = null; // OMDB ger ej trailerdata
    const runtime = data.Runtime;
    const releaseDate = data.Released;

    // Infoga filmdata i databasen
    const info = insertMovie(
      title,
      description,
      genre,
      rated,
      poster,
      trailer,
      runtime,
      releaseDate
    );

    res.json({ message: "Filmen har lagts till", id: info.lastInsertRowid });
  } catch (error) {
    console.error("Fel vid hämtning eller insättning:", error);
    res.status(500).json({ error: "Något gick fel" });
  }
};

export const getAllMoviesHandler = (req, res) => {
  try {
    const movies = getAllMovies();
    res.json(movies);
  } catch (error) {
    console.error("Fel vid hämtning av filmer:", error);
    res.status(500).json({ error: "Något gick fel" });
  }
};

export const deleteMovieHandler = (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Filmens id saknas" });
    }
    const result = deleteMovie(id);
    res.status(200).json({ message: "Film raderad", result });
  } catch (error) {
    console.error("Fel vid radering av film:", error);
    if (error.message === "Filmen hittades inte") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: "Något gick fel vid radering av film" });
  }
};
