import { db } from "../Config/database.js";

export const getAllActors = () => {
  const rows = db
    .prepare("SELECT movie_actors FROM movies WHERE movie_isDeleted = 0")
    .all();

  const actorSet = new Set();
  rows.forEach(({ movie_actors }) => {
    if (movie_actors) {
      movie_actors.split(",").forEach(name => {
        const actor = name.trim();
        if (actor) actorSet.add(actor);
      });
    }
  });

  return Array.from(actorSet).sort();
};

export const getActorsByMovieId = movieId => {
  const row = db
    .prepare(
      "SELECT movie_actors FROM movies WHERE movie_id = ? AND movie_isDeleted = 0"
    )
    .get(movieId);

  if (!row) return null;
  if (!row.movie_actors) return [];

  return row.movie_actors.split(",").map(name => name.trim());
};

export const getMoviesByActor = actorName => {
  const stmt = db.prepare(
    "SELECT * FROM movies WHERE movie_isDeleted = 0 AND movie_actors LIKE ? COLLATE NOCASE"
  );
  return stmt.all(`%${actorName}%`);
};
