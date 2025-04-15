import { useState } from "react";

export const AdderaFilm = () => {
  const [movieName, setMovieName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/movies/${encodeURIComponent(movieName)}`);
      const data = await response.json();
      if (response.ok) {
        setMessage(`Filmen har lagts till med namn: ${data.title} och id: ${data.id}`);
      } else {
        setMessage(`Fel: ${data.error}`);
      }
    } catch (error) {
      setMessage(`Något gick fel: ${error.message}`);
    }
  };

  return (
    <section>
      <h1>Lägg till film</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Filmtitel:
          <input
            type="text"
            value={movieName}
            onChange={e => setMovieName(e.target.value)}
            required
          />
        </label>
        <button type="submit">Lägg till film</button>
      </form>
      {message && <p>{message}</p>}
    </section>
  );
};
