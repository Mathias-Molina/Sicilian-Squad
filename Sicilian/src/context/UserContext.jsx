import { createContext, useState, useEffect } from 'react';

const UserContext = createContext();

export { UserContext };

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await fetch('http://localhost:3000/user/whoami', {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json();
        if (response.ok) {
          setUser(data);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      }
    };

    checkUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
