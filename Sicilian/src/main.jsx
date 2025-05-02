import { createRoot } from 'react-dom/client';
import { router } from './router';
import { RouterProvider } from 'react-router-dom';
import './styling/index.css';
import { UserProvider } from './context/UserContext';
import { MovieProvider } from './context/MovieContext';

createRoot(document.getElementById('root')).render(
  <UserProvider>
    <MovieProvider>
      <RouterProvider router={router} />
    </MovieProvider>
  </UserProvider>
);
