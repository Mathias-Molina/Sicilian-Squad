import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export const LoggaIn = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    const endpoint = isRegister
      ? 'http://localhost:3000/user/register'
      : 'http://localhost:3000/user/login';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        // Vid registrering skickas { name, username, password }
        // Vid inloggning skickas { username, password }
        body: JSON.stringify(
          isRegister ? { name, username, password } : { username, password }
        ),
      });
      const data = await response.json();

      if (response.ok) {
        // Hämta korrekt användarinformation via whoami
        const whoamiRes = await fetch('http://localhost:3000/user/whoami', {
          method: 'GET',
          credentials: 'include',
        });
        const userInfo = await whoamiRes.json();
        setUser({ ...userInfo, user_id: userInfo.id });

        // Rensa formuläret
        setUsername('');
        setPassword('');
        if (isRegister) setName('');

        // Navigera direkt till Mina bokningar (eller annan dashboard)
        navigate('/');
      } else {
        setMessage(data.message || 'Fel vid inloggning/registrering');
      }
    } catch (error) {
      setMessage('Något gick fel');
    }
  };

  return (
    <section>
      <h1>{isRegister ? 'Registrera dig' : 'Logga in'}</h1>
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <>
            <label htmlFor='name'>Namn</label>
            <input
              type='text'
              id='name'
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </>
        )}
        <label htmlFor='username'>Användarnamn</label>
        <input
          type='text'
          id='username'
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <label htmlFor='password'>Lösenord</label>
        <input
          type='password'
          id='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type='submit'>{isRegister ? 'Registrera' : 'Logga in'}</button>
      </form>
      <button onClick={() => setIsRegister(!isRegister)}>
        {isRegister
          ? 'Har redan ett konto? Logga in'
          : 'Inget konto? Registrera dig'}
      </button>
      {message && <p>{message}</p>}
    </section>
  );
};
