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
    const s = new Set();
    if (g) s.add(g); // Only one genre selected at a time
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
    <div className="toolbar-wrapper">
      <div className="toolbar-buttons">
        <button onClick={() => setOpen(o => !o)} className="btn-filter1">
          Filters
        </button>
        <button onClick={onShow} className="btn-filter">
          Se visningar
        </button>
      </div>

      {open && (
        <div className="filter-panel">
          <section className="filter-section">
            <h4>Genrer</h4>
            <div className="clickable-list">
              {genres.map(g => (
                <span
                  key={g}
                  className={`clickable-item ${selGenres.has(g) ? "selected" : ""}`}
                  onClick={() => toggleGenre(g)}
                >
                  {g}
                </span>
              ))}
            </div>
          </section>

          <section className="filter-section">
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

          <section className="filter-section">
            <h4>Skådespelare</h4>
            <div className="clickable-list scrollable-actors">
              {actors.map(a => (
                <span
                  key={a}
                  className={`clickable-item ${selActors.has(a) ? "selected" : ""}`}
                  onClick={() => toggleActor(a)}
                >
                  {a}
                </span>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
