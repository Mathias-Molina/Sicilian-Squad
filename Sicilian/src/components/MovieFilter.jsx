import { useState, useEffect } from "react";
import { getActors, getGenres, getRatings } from "../api/apiMovies";
import { ratingToAge } from "../utils/ratingToAge";

export const MovieFilter = ({ onChange, onShow }) => {
  const [open, setOpen] = useState(false);
  const [genres, setGenres] = useState([]);
  const [actors, setActors] = useState([]);
  const [ratings, setRatings] = useState([]);

  const [selGenres, setSelGenres] = useState(new Set());
  const [selActors, setSelActors] = useState(new Set());
  const [selAge, setSelAge] = useState("");

  useEffect(() => {
    getGenres().then(data => setGenres(data ?? []));
    getActors().then(data => setActors(data ?? []));
    getRatings().then(data => setRatings(data ?? []));
  }, []);

  const applyChange = (nextGenres, nextActors, nextAge) => {
    onChange({
      genres: Array.from(nextGenres),
      actors: Array.from(nextActors),
      age: nextAge === "0" ? null : nextAge,
    });
  };

  const toggleGenre = g => {
    const s = new Set(selGenres);
    s.has(g) ? s.delete(g) : s.add(g);
    setSelGenres(s);
    applyChange(s, selActors, selAge);
  };

  const toggleActor = a => {
    const s = new Set(selActors);
    s.has(a) ? s.delete(a) : s.add(a);
    setSelActors(s);
    applyChange(selGenres, s, selAge);
  };

  const handleAge = e => {
    const age = e.target.value;
    setSelAge(age);
    applyChange(selGenres, selActors, age);
  };

  const uniqueAges = Array.from(new Set(ratings.map(r => ratingToAge(r))))
    .filter(a => a > 0)
    .sort((a, b) => a - b);

  return (
    <div className="toolbar">
      <div className="toolbar-buttons">
        <button onClick={() => setOpen(o => !o)} className="btn-filter">
          Filtrera
        </button>
        <button onClick={onShow} className="btn-filter">
          Se visningar
        </button>
      </div>

      {open && (
        <div className="filter-panel">
          <section>
            <h4>Genrer</h4>
            {genres.map(g => (
              <label key={g}>
                <input
                  type="checkbox"
                  checked={selGenres.has(g)}
                  onChange={() => toggleGenre(g)}
                />
                {g}
              </label>
            ))}
          </section>

          <section>
            <h4>Ålder</h4>
            <select value={selAge} onChange={handleAge}>
              <option value="">Alla åldrar</option>
              {uniqueAges.map(age => (
                <option key={age} value={age}>
                  Upp till {age} år
                </option>
              ))}
            </select>
          </section>

          <section>
            <h4>Skådespelare</h4>
            {actors.map(a => (
              <label key={a}>
                <input
                  type="checkbox"
                  checked={selActors.has(a)}
                  onChange={() => toggleActor(a)}
                />
                {a}
              </label>
            ))}
          </section>
        </div>
      )}
    </div>
  );
};
