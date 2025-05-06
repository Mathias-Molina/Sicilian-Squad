import { useState, useEffect } from 'react';
import { getActors, getGenres, getRatings } from '../api/apiMovies';
import { ratingToAge } from '../utils/ratingToAge';
export const MovieFilter = ({ onChange, onShow }) => {
  const [open, setOpen] = useState(false);
  const [genres, setGenres] = useState([]);
  const [actors, setActors] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [selGenres, setSelGenres] = useState(new Set());
  const [selActors, setSelActors] = useState(new Set());
  const [selAge, setSelAge] = useState('');
  useEffect(() => {
    getGenres().then(data => setGenres(data ?? []));
    getActors().then(data => setActors(data ?? []));
    getRatings().then(data => setRatings(data ?? []));
  }, []);
  const applyChange = (nextGenres, nextActors, nextAge) => {
    onChange({
      genres: Array.from(nextGenres),
      actors: Array.from(nextActors),
      age: nextAge !== '' ? Number(nextAge) : null,
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
  const uniqueAges = Array.from(
    new Set(ratings.map(r => ratingToAge(r?.toUpperCase())))
  )
    .filter(a => a >= 0 && a < 100)
    .sort((a, b) => a - b);

  return (
    <div className='toolbar'>
      <div className='toolbar-buttons'>
        <button onClick={() => setOpen(o => !o)} className='btn-filter'>
          Filtrera
        </button>
        <button onClick={onShow} className='btn-filter'>
          Se visningar
        </button>
      </div>
      {open && (
        <div className='filter-panel'>
          <section className='filter-section'>
            <h4>Genrer</h4>
            <div className='clickable-list'>
              {genres.map(g => (
                <div
                  key={g}
                  className={`clickable-item ${
                    selGenres.has(g) ? 'selected' : ''
                  }`}
                  onClick={() => toggleGenre(g)}
                >
                  {g}
                </div>
              ))}
            </div>
          </section>
          <section>
            <h4>Ålder</h4>
            <div className='select-wrapper'>
              <select value={selAge} onChange={handleAge}>
                <option value=''>Alla åldrar</option>
                {uniqueAges.map(age => {
                  let label = '';
                  if (age === 0) label = 'Barntillåten';
                  else if (age === 7) label = 'Från 7 år';
                  else if (age === 13) label = 'Från 13 år';
                  else if (age === 14) label = 'Från 14 år';
                  else if (age === 17) label = 'Från 17 år';
                  else if (age === 18) label = 'Från 18 år';
                  else label = `Från ${age} år`;

                  return (
                    <option key={age} value={age}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </div>
          </section>
          <section className='filter-section'>
            <h4>Skådespelare</h4>
            <div className='clickable-list scrollable-actors'>
              {actors.map(a => (
                <div
                  key={a}
                  className={`clickable-item ${
                    selActors.has(a) ? 'selected' : ''
                  }`}
                  onClick={() => toggleActor(a)}
                >
                  {a}
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
