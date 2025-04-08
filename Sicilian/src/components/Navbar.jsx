import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import logo from '../assets/The-Sicilian-Squad.jpg';

export const Navbar = () => {
  const { user, setUser } = useContext(UserContext);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/user/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        setUser(null);
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className='navbar'>
      <div className='navbar-content'>
        {/* Left section */}
        <div className='nav-left'>
          <ul className='navbar-list'>
            <li className='navbar-item'>
              <NavLink to='/home'>Hem</NavLink>
            </li>
            <li className='navbar-item'>
              <NavLink to='/min-sida'>Mina bokningar</NavLink>
            </li>
          </ul>
        </div>

        {/* Center section - Logo */}
        <div className='nav-center'>
          <NavLink to='/home'>
            <img src={logo} alt='The Sicilian Squad' className='nav-logo' />
          </NavLink>
        </div>

        {/* Right section */}
        <div className='nav-right'>
          <ul className='navbar-list'>
            {user ? (
              <>
                <li className='navbar-item'>
                  Inloggad som: <strong>{user.username}</strong>
                </li>
                <li className='navbar-item'>
                  <button onClick={handleLogout}>Logga ut</button>
                </li>
              </>
            ) : (
              <li className='navbar-item'>
                <NavLink to='/logga-in'>Logga in</NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
