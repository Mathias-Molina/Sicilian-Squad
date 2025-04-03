import { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';

export const LoggaIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(UserContext);

  const loginUser = async e => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/user/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Login successful:', data);
        setUser(data); // Update the UserContext with the logged-in user's data
        setUsername('');
        setPassword('');
      } else {
        console.log('wrong credentials');
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  return (
    <section>
      <form action='submit' onSubmit={e => loginUser(e)}>
        <label htmlFor=''>username</label>
        <input type='text' onChange={e => setUsername(e.target.value)} />
        <label htmlFor=''>password</label>
        <input type='text' onChange={e => setPassword(e.target.value)} />
        <button type='submit'>Log In</button>
      </form>
    </section>
  );
};
