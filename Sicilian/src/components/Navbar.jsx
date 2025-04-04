import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export const Navbar = () => {
  const { user, setUser } = useContext(UserContext);

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

  return (
    <nav className="navbar">
      <section className="navbar-links">
        <ul className="navbar-list">
          <li className="navbar-item">
            <NavLink to="/home">Hem</NavLink>
          </li>
          <li className="navbar-item">
            <NavLink to="/min-sida">Mina bokningar</NavLink>
          </li>
          {user ? (
            <>
              <li className="navbar-item">
                <button onClick={handleLogout}>Logga ut</button>
              </li>
            </>
          ) : (
            <li className="navbar-item">
              <NavLink to="/logga-in">Logga in</NavLink>
            </li>
          )}
        </ul>
      </section>
    </nav>
  );
};
