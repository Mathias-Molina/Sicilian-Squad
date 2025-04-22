import { useState } from 'react';

export const AdderaFilm = () => {
  const [movieName, setMovieName] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messageType, setMessageType] = useState(''); //success eller error

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/add/${movieName}`);
      const data = await response.json();
      if (response.ok) {
        setMessage(
          `Filmen har lagts till med namn: ${data.title} och id: ${data.id}`
        );
        setMessageType('success');
        setMovieName('');
      } else {
        setMessage(`Fel: ${data.error}`);
        setMessageType('error');
      }
    } catch (error) {
      setMessage(`Något gick fel: ${error.message}`);
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='add-movie-wrapper'>
      <div className='add-movie-card'>
        <h1 className='add-movie-title'>Lägg till film</h1>

        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label className='form-label'>Filmtitel:</label>
            <input
              type='text'
              id='movieTitle'
              className='form-input'
              value={movieName}
              onChange={e => setMovieName(e.target.value)}
              placeholder='Ange filmens titel'
              required
            />
          </div>

          <button
            type='submit'
            className='add-movie-button'
            disabled={isLoading}
          >
            {isLoading ? 'Lägger till...' : 'Lägg till film'}
          </button>
        </form>
        {message && (
          <div className={`message ${messageType}`}>
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};
