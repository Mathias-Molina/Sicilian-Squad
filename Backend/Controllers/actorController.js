import { getAllActors, getActorsByMovieId } from "../Models/actorModel.js";

export const getAllActorsHandler = (req, res) => {
  try {
    const actors = getAllActors();
    res.json(actors);
  } catch (error) {
    console.error("Fel vid hämtning av aktörer:", error);
    res.status(500).json({ error: "Något gick fel" });
  }
};

export const getActorsByMovieIdHandler = (req, res) => {
  const { movieId } = req.params;
  if (!movieId) {
    return res.status(400).json({ error: "Filmens id saknas" });
  }

  try {
    const actors = getActorsByMovieId(movieId);
    if (actors === null) {
      return res.status(404).json({ error: "Filmen hittades inte" });
    }
    res.json(actors);
  } catch (error) {
    console.error("Fel vid hämtning av aktörer för film:", error);
    res.status(500).json({ error: "Något gick fel" });
  }
};
