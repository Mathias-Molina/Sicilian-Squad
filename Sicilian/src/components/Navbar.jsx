import { useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import logo from "../assets/The-Sicilian-Squad.jpg";
import { motion } from "framer-motion";
import { FaUser } from "react-icons/fa";

export const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const location = useLocation();
  const { pathname } = location;
  console.log(pathname);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/user/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        setUser(null);
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const routes = [
    {
      name: "hem",
      path: "/",
    },
    {
      name: "mina bokningar",
      path: "/min-sida",
    },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* Left section */}
        <div className="nav-left">
          <ul className="navbar-list">
            {routes.map((route) => (
              <li className="navbar-item">
                <NavLink to={route.path}>
                  {route.name.substring(0, 1).toUpperCase() +
                    route.name.slice(1)}
                </NavLink>
                {pathname === route.path && (
                  <motion.div
                    layoutId="header-active-link"
                    className="navbar-highlight"
                  ></motion.div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Center section - Logo */}
        <div className="nav-center">
          <NavLink to="/">
            <img src={logo} alt="The Sicilian Squad" className="nav-logo" />
          </NavLink>
        </div>

        {/* Right section */}
        <div className="nav-right">
          <ul className="navbar-list">
            {user ? (
              <>
                <li className="navbar-item">
                  <div className="user-navbar-item ">
                    <FaUser />
                    Inloggad som: <strong>{user.username}</strong>
                    <button onClick={handleLogout}>Logga ut</button>
                  </div>
                </li>
              </>
            ) : (
              <li className="navbar-item">
                <NavLink to="/logga-in">
                  <FaUser />
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
